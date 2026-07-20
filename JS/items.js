const API_URL = 'http://localhost:3000/itens';
const PEDIDOS_URL = 'http://localhost:3000/pedidos';
const PRODUTOS_URL = 'http://localhost:3000/produtos';

let pedidosCache = [];
let produtosCache = [];
let itensCache = [];

async function carregarListasRelacionadas() {
    try {
        const [pedidos, produtos] = await Promise.all([
            apiFetch(PEDIDOS_URL),
            apiFetch(PRODUTOS_URL)
        ]);
        pedidosCache = pedidos;
        produtosCache = produtos;

        preencherSelect("pedidoAdd", pedidosCache, "Selecione um pedido...", p => `Pedido #${p.id} - ${p.data}`);
        preencherSelect("pedidoEdit", pedidosCache, "Selecione um pedido...", p => `Pedido #${p.id} - ${p.data}`);
        preencherSelect("produtoAdd", produtosCache, "Selecione um produto...", p => p.descricao);
        preencherSelect("produtoEdit", produtosCache, "Selecione um produto...", p => p.descricao);

        // Ao escolher o produto, já sugere descrição e valor unitário dele
        ligarAutoPreenchimento("Add");
        ligarAutoPreenchimento("Edit");
    } catch (erro) {
        mostrarErro(erro);
    }
}

function ligarAutoPreenchimento(sufixo) {
    const selectProduto = document.getElementById(`produto${sufixo}`);
    const inputDescricao = document.getElementById(`descricao${sufixo}`);
    const inputValor = document.getElementById(`valor${sufixo}`);
    const inputQuantidade = document.getElementById(`quantidade${sufixo}`);

    if (!selectProduto) return;

    selectProduto.addEventListener("change", () => {
        const produto = produtosCache.find(p => p.id == selectProduto.value);
        if (produto) {
            if (inputDescricao && !inputDescricao.value) inputDescricao.value = produto.descricao;
            if (inputValor) inputValor.value = produto.valor_unit;
            recalcularSubtotal(sufixo);
        }
    });

    [inputValor, inputQuantidade].forEach(campo => {
        if (campo) campo.addEventListener("input", () => recalcularSubtotal(sufixo));
    });
}

function recalcularSubtotal(sufixo) {
    const valor = Number(document.getElementById(`valor${sufixo}`).value) || 0;
    const quantidade = Number(document.getElementById(`quantidade${sufixo}`).value) || 0;
    document.getElementById(`subtotal${sufixo}`).value = (valor * quantidade).toFixed(2);
}

async function listar() {
    try {
        itensCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        itensCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    itensCache.forEach(tipo => {
        const numeroPedido = pedidosCache.find(p => p.id == tipo.pedido_id)?.id ?? tipo.pedido_id;
        const nomeProduto = produtosCache.find(p => p.id == tipo.produto_id)?.descricao ?? tipo.produto_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(numeroPedido)}</td>
                <td>${escapeHtml(nomeProduto)}</td>
                <td>${escapeHtml(tipo.descricao)}</td>
                <td>${tipo.valor_unit}</td>
                <td>${tipo.quantidade}</td>
                <td>${tipo.subtotal}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id})">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function lerFormulario(sufixo) {
    return {
        pedido_id: document.getElementById(`pedido${sufixo}`).value,
        produto_id: document.getElementById(`produto${sufixo}`).value,
        descricao: limparEspacos(document.getElementById(`descricao${sufixo}`).value),
        valor_unit: Number(document.getElementById(`valor${sufixo}`).value),
        quantidade: Number(document.getElementById(`quantidade${sufixo}`).value),
        subtotal: Number(document.getElementById(`subtotal${sufixo}`).value)
    };
}

function dadosValidos(dados) {
    if (!dados.pedido_id || !dados.produto_id) {
        alert("Selecione o Pedido e o Produto.");
        return false;
    }
    if (isNaN(dados.valor_unit) || dados.valor_unit < 0) {
        alert("Informe um Valor Unitário válido.");
        return false;
    }
    if (isNaN(dados.quantidade) || dados.quantidade < 1 || !Number.isInteger(dados.quantidade)) {
        alert("Informe uma Quantidade válida (inteiro maior que 0).");
        return false;
    }
    return true;
}

async function criar() {
    const form = document.getElementById("formAdicionar");
    if (form && !form.reportValidity()) return;

    recalcularSubtotal("Add");
    const dados = lerFormulario("Add");
    if (!dadosValidos(dados)) return;

    try {
        await apiFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        form.reset();
        fecharModal("modalAdicionar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function abrirEditar(id) {
    const item = itensCache.find(i => i.id === id);
    if (!item) {
        mostrarErro(new Error("Item não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = item.id;
    document.getElementById("pedidoEdit").value = item.pedido_id;
    document.getElementById("produtoEdit").value = item.produto_id;
    document.getElementById("descricaoEdit").value = item.descricao;
    document.getElementById("valorEdit").value = item.valor_unit;
    document.getElementById("quantidadeEdit").value = item.quantidade;
    document.getElementById("subtotalEdit").value = item.subtotal;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
    recalcularSubtotal("Edit");
    const dados = lerFormulario("Edit");
    if (!dadosValidos(dados)) return;

    try {
        await apiFetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        fecharModal("modalEditar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function deletar(id) {
    if (!confirm("Deseja excluir este Item?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function iniciar() {
    await carregarListasRelacionadas();
    await listar();
}

iniciar();
