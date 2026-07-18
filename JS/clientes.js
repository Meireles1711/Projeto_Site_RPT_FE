const API_URL = 'http://localhost:3000/clientes';
const CIDADES_URL = 'http://localhost:3000/cidades';

let cidadesCache = [];

/* ---------- Helpers de tratamento de dados ---------- */
function limparEspacos(v) {
    return (v ?? '').trim();
}

function somenteNumeros(v) {
    return (v ?? '').replace(/\D/g, '');
}

/* Carrega a lista de cidades e preenche os dois selects (Add/Edit) */
async function carregarCidades() {
    try {
        const res = await fetch(CIDADES_URL);
        cidadesCache = await res.json();

        ["cidadeAdd", "cidadeEdit"].forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            const valorAtual = select.value;
            select.innerHTML = '<option value="" selected disabled>Selecione uma cidade...</option>';
            cidadesCache.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.nome} - ${c.uf}</option>`;
            });
            if (valorAtual) select.value = valorAtual;
        });
    } catch (e) {
        console.error("Não foi possível carregar as cidades:", e);
    }
}

async function listar() {

    const res = await fetch(API_URL);
    const clientes = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    clientes.forEach(tipo => {
        const nomeCidade = cidadesCache.find(c => c.id == tipo.cidade_id)?.nome ?? tipo.cidade_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.nome}</td>
                <td>${tipo.cpf}</td>
                <td>${nomeCidade}</td>
                <td>${tipo.telefone}</td>
                <td>${tipo.email}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id},'${tipo.nome ?? ''}','${tipo.endereco ?? ''}','${tipo.bairro ?? ''}','${tipo.cep ?? ''}','${tipo.cidade_id ?? ''}','${tipo.cpf ?? ''}','${tipo.email ?? ''}','${tipo.telefone ?? ''}','${(tipo.observacoes ?? '').replace(/'/g, "\\'")}')">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `
    });
}

/* Lê e já normaliza os campos do formulário (CPF/CEP/telefone só dígitos,
   textos sem espaço sobrando) — isso garante que o que chega no banco
   segue sempre o mesmo formato, não importa como a pessoa digitou */
function lerFormulario(sufixo) {
    return {
        nome: limparEspacos(document.getElementById(`nome${sufixo}`).value),
        endereco: limparEspacos(document.getElementById(`endereco${sufixo}`).value),
        bairro: limparEspacos(document.getElementById(`bairro${sufixo}`).value),
        cep: somenteNumeros(document.getElementById(`cep${sufixo}`).value),
        cidade_id: document.getElementById(`cidade${sufixo}`).value,
        cpf: somenteNumeros(document.getElementById(`cpf${sufixo}`).value),
        email: limparEspacos(document.getElementById(`email${sufixo}`).value).toLowerCase(),
        telefone: somenteNumeros(document.getElementById(`telefone${sufixo}`).value),
        observacoes: limparEspacos(document.getElementById(`obs${sufixo}`).value)
    };
}

function dadosValidos(dados) {
    if (!dados.nome) {
        alert("O Nome é obrigatório.");
        return false;
    }
    if (dados.cpf.length !== 11) {
        alert("Informe um CPF válido (11 dígitos).");
        return false;
    }
    if (!dados.cidade_id) {
        alert("Selecione uma Cidade.");
        return false;
    }
    if (dados.telefone && dados.telefone.length < 10) {
        alert("Informe um telefone válido, com DDD.");
        return false;
    }
    if (dados.cep && dados.cep.length !== 8) {
        alert("Informe um CEP válido (8 dígitos).");
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

function abrirEditar(id, nome, endereco, bairro, cep, cidade_id, cpf, email, telefone, observacoes) {
    document.getElementById("idEdit").value = id;
    document.getElementById("nomeEdit").value = nome;
    document.getElementById("enderecoEdit").value = endereco;
    document.getElementById("bairroEdit").value = bairro;
    document.getElementById("cepEdit").value = cep;
    document.getElementById("cidadeEdit").value = cidade_id;
    document.getElementById("cpfEdit").value = cpf;
    document.getElementById("emailEdit").value = email;
    document.getElementById("telefoneEdit").value = telefone;
    document.getElementById("obsEdit").value = observacoes;

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
    if (!confirm("Deseja excluir este Cliente?")) return;
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    listar();
}

async function iniciar() {
    await carregarCidades();
    await listar();
}

iniciar();
