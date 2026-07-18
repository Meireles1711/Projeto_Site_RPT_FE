const API_URL = 'http://localhost:3000/produtos';

function limparEspacos(v) {
    return (v ?? '').trim();
}

async function listar() {

    const res = await fetch(API_URL);
    const produtos = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    produtos.forEach(tipo => {
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.descricao}</td>
                <td>${tipo.unidade}</td>
                <td>${tipo.valor_unit}</td>
                <td>${tipo.estoque}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id},'${tipo.descricao}','${tipo.unidade}','${tipo.valor_unit}','${tipo.estoque}')">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `
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

function abrirEditar(id, descricao, unidade, valor_unit, estoque) {
    document.getElementById("idEdit").value = id;
    document.getElementById("descricaoEdit").value = descricao;
    document.getElementById("unidadeEdit").value = unidade;
    document.getElementById("valorEdit").value = valor_unit;
    document.getElementById("estoqueEdit").value = estoque;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
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
    if (!confirm("Deseja excluir este Produto?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    listar();
}

listar();
