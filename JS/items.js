const API_URL = 'http://localhost:3000/itens';
const PEDIDOS_URL = 'http://localhost:3000/pedidos';
const PRODUTOS_URL = 'http://localhost:3000/produtos';

let pedidosCache = [];
let produtosCache = [];

async function carregarListasRelacionadas() {
    try {
        const [resPedidos, resProdutos] = await Promise.all([
            fetch(PEDIDOS_URL),
            fetch(PRODUTOS_URL)
        ]);
        pedidosCache = await resPedidos.json();
        produtosCache = await resProdutos.json();

        preencherSelect("pedidoAdd", pedidosCache, "Selecione um pedido...", p => `Pedido #${p.id} - ${p.data}`);
        preencherSelect("pedidoEdit", pedidosCache, "Selecione um pedido...", p => `Pedido #${p.id} - ${p.data}`);
        preencherSelect("produtoAdd", produtosCache, "Selecione um produto...", p => p.descricao);
        preencherSelect("produtoEdit", produtosCache, "Selecione um produto...", p => p.descricao);

        // Ao escolher o produto, já sugere descrição e valor unitário dele
        ligarAutoPreenchimento("Add");
        ligarAutoPreenchimento("Edit");
    } catch (e) {
        console.error("Não foi possível carregar pedidos/produtos:", e);
    }
}

function preencherSelect(selectId, lista, placeholder, rotulo) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const valorAtual = select.value;
    select.innerHTML = `<option value="" selected disabled>${placeholder}</option>`;
    lista.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${rotulo(item)}</option>`;
    });
    if (valorAtual) select.value = valorAtual;
}

function ligarAutoPreenchimento(sufixo) {
    const selectProduto = document.getElementById(`produto${sufixo}`);
    const inputDescricao = document.getElementById(`descricao${sufixo}`);
    const inputValor = document.getElementById(`valor${sufixo}`);
    const inputQuantidade = document.getElementById(`quantidade${sufixo}`);
    const inputSubtotal = document.getElementById(`subtotal${sufixo}`);

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

    const res = await fetch(API_URL);
    const itens = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    itens.forEach(tipo => {
        const numeroPedido = pedidosCache.find(p => p.id == tipo.pedido_id)?.id ?? tipo.pedido_id;
        const nomeProduto = produtosCache.find(p => p.id == tipo.produto_id)?.descricao ?? tipo.produto_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${numeroPedido}</td>
                <td>${nomeProduto}</td>
                <td>${tipo.descricao}</td>
                <td>${tipo.valor_unit}</td>
                <td>${tipo.quantidade}</td>
                <td>${tipo.subtotal}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id},'${tipo.pedido_id}','${tipo.produto_id}','${(tipo.descricao ?? '').replace(/'/g, "\\'")}','${tipo.valor_unit}','${tipo.quantidade}','${tipo.subtotal}')">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `
    });
}

function lerFormulario(sufixo) {
    return {
        pedido_id: document.getElementById(`pedido${sufixo}`).value,
        produto_id: document.getElementById(`produto${sufixo}`).value,
        descricao: (document.getElementById(`descricao${sufixo}`).value ?? '').trim(),
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

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(dados)
    });
    fecharModal("modalAdicionar");
    listar();
}

function abrirModalAdicionar() {
    document.getElementById("modalAdicionar").style.display = "flex";
}

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

function abrirEditar(id, pedido_id, produto_id, descricao, valor_unit, quantidade, subtotal) {
    document.getElementById("idEdit").value = id;
    document.getElementById("pedidoEdit").value = pedido_id;
    document.getElementById("produtoEdit").value = produto_id;
    document.getElementById("descricaoEdit").value = descricao;
    document.getElementById("valorEdit").value = valor_unit;
    document.getElementById("quantidadeEdit").value = quantidade;
    document.getElementById("subtotalEdit").value = subtotal;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
    recalcularSubtotal("Edit");
    const dados = lerFormulario("Edit");
    if (!dadosValidos(dados)) return;

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    fecharModal("modalEditar");
    listar();
}

async function deletar(id) {
    if (!confirm("Deseja excluir este Item?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    listar();
}

async function iniciar() {
    await carregarListasRelacionadas();
    await listar();
}

iniciar();
