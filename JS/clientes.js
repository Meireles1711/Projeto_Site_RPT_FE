const API_URL = 'http://localhost:3000/clientes';
const CIDADES_URL = 'http://localhost:3000/cidades';

let cidadesCache = [];
let clientesCache = [];

/* Carrega a lista de cidades e preenche os dois selects (Add/Edit) */
async function carregarCidades() {
    try {
        cidadesCache = await apiFetch(CIDADES_URL);
    } catch (erro) {
        mostrarErro(erro);
        cidadesCache = [];
    }

    preencherSelect("cidadeAdd", cidadesCache, "Selecione uma cidade...", c => `${c.nome} - ${c.uf}`);
    preencherSelect("cidadeEdit", cidadesCache, "Selecione uma cidade...", c => `${c.nome} - ${c.uf}`);
}

async function listar() {
    try {
        clientesCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        clientesCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    clientesCache.forEach(tipo => {
        const nomeCidade = cidadesCache.find(c => c.id == tipo.cidade_id)?.nome ?? tipo.cidade_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(tipo.nome)}</td>
                <td>${escapeHtml(tipo.cpf)}</td>
                <td>${escapeHtml(nomeCidade)}</td>
                <td>${escapeHtml(tipo.telefone)}</td>
                <td>${escapeHtml(tipo.email)}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id})">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `;
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
        // Erro comum aqui: CPF duplicado (UNIQUE KEY cpf_UNIQUE).
        mostrarErro(erro);
    }
}

function abrirEditar(id) {
    const cliente = clientesCache.find(c => c.id === id);
    if (!cliente) {
        mostrarErro(new Error("Cliente não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = cliente.id;
    document.getElementById("nomeEdit").value = cliente.nome;
    document.getElementById("enderecoEdit").value = cliente.endereco;
    document.getElementById("bairroEdit").value = cliente.bairro;
    document.getElementById("cepEdit").value = cliente.cep;
    document.getElementById("cidadeEdit").value = cliente.cidade_id;
    document.getElementById("cpfEdit").value = cliente.cpf;
    document.getElementById("emailEdit").value = cliente.email;
    document.getElementById("telefoneEdit").value = cliente.telefone;
    document.getElementById("obsEdit").value = cliente.observacoes;

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
    if (!confirm("Deseja excluir este Cliente?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        // Erro comum aqui: cliente com pedidos vinculados (FK RESTRICT).
        mostrarErro(erro);
    }
}

async function iniciar() {
    await carregarCidades();
    await listar();
}

iniciar();
