const API_URL = 'http://localhost:3000/produtos';

let produtosCache = [];

async function listar() {
    try {
        produtosCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        produtosCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    produtosCache.forEach(tipo => {
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(tipo.descricao)}</td>
                <td>${escapeHtml(tipo.unidade)}</td>
                <td>${tipo.valor_unit}</td>
                <td>${tipo.estoque}</td>

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
        descricao: limparEspacos(document.getElementById(`descricao${sufixo}`).value),
        unidade: limparEspacos(document.getElementById(`unidade${sufixo}`).value).toUpperCase(),
        valor_unit: Number(document.getElementById(`valor${sufixo}`).value),
        estoque: Number(document.getElementById(`estoque${sufixo}`).value)
    };
}

function dadosValidos(dados) {
    if (!dados.descricao) {
        alert("A Descrição é obrigatória.");
        return false;
    }
    if (isNaN(dados.valor_unit) || dados.valor_unit < 0) {
        alert("Informe um Valor Unitário válido (maior ou igual a 0).");
        return false;
    }
    if (isNaN(dados.estoque) || dados.estoque < 0 || !Number.isInteger(dados.estoque)) {
        alert("Informe um Estoque válido (número inteiro maior ou igual a 0).");
        return false;
    }
    return true;
}

async function criar() {
    const form = document.getElementById("formAdicionar");
    if (form && !form.reportValidity()) return;

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
    const produto = produtosCache.find(p => p.id === id);
    if (!produto) {
        mostrarErro(new Error("Produto não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = produto.id;
    document.getElementById("descricaoEdit").value = produto.descricao;
    document.getElementById("unidadeEdit").value = produto.unidade;
    document.getElementById("valorEdit").value = produto.valor_unit;
    document.getElementById("estoqueEdit").value = produto.estoque;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
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
    if (!confirm("Deseja excluir este Produto?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        // Erro comum aqui: produto em uso em itens_pedido (FK RESTRICT).
        mostrarErro(erro);
    }
}

listar();
