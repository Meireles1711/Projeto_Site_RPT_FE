const API_URL = 'http://localhost:3000/pedidos';
const CLIENTES_URL = 'http://localhost:3000/clientes';
const CONDICAO_URL = 'http://localhost:3000/condicao';
const FORMAS_URL = 'http://localhost:3000/formas';

let clientesCache = [];
let condicoesCache = [];
let formasCache = [];
let pedidosCache = [];

async function carregarListasRelacionadas() {
    try {
        const [clientes, condicoes, formas] = await Promise.all([
            apiFetch(CLIENTES_URL),
            apiFetch(CONDICAO_URL),
            apiFetch(FORMAS_URL)
        ]);
        clientesCache = clientes;
        condicoesCache = condicoes;
        formasCache = formas;

        preencherSelect("clienteAdd", clientesCache, "Selecione um cliente...", c => c.nome);
        preencherSelect("clienteEdit", clientesCache, "Selecione um cliente...", c => c.nome);
        preencherSelect("condicaoAdd", condicoesCache, "Selecione...", c => c.descricao);
        preencherSelect("condicaoEdit", condicoesCache, "Selecione...", c => c.descricao);
        preencherSelect("formaAdd", formasCache, "Selecione...", f => f.descricao);
        preencherSelect("formaEdit", formasCache, "Selecione...", f => f.descricao);
    } catch (erro) {
        mostrarErro(erro);
    }
}

/* Garante o formato YYYY-MM-DD exigido pelo <input type="date">.
   Se a API devolver algo como "2024-01-15T00:00:00.000Z", o campo
   ficava em branco ao editar — aqui cortamos para os 10 primeiros
   caracteres. */
function paraDataInput(valor) {
    return (valor ?? '').toString().slice(0, 10);
}

async function listar() {
    try {
        pedidosCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        pedidosCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    pedidosCache.forEach(tipo => {
        const nomeCliente = clientesCache.find(c => c.id == tipo.cliente_id)?.nome ?? tipo.cliente_id;
        const descCondicao = condicoesCache.find(c => c.id == tipo.condicao_pagamento_id)?.descricao ?? tipo.condicao_pagamento_id;
        const descForma = formasCache.find(f => f.id == tipo.forma_pagamento_id)?.descricao ?? tipo.forma_pagamento_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(tipo.data)}</td>
                <td>${escapeHtml(nomeCliente)}</td>
                <td>${escapeHtml(descCondicao)}</td>
                <td>${escapeHtml(descForma)}</td>
                <td>${escapeHtml(tipo.prazo_entrega)}</td>

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
        data: document.getElementById(`data${sufixo}`).value,
        cliente_id: document.getElementById(`cliente${sufixo}`).value,
        condicao_pagamento_id: document.getElementById(`condicao${sufixo}`).value,
        forma_pagamento_id: document.getElementById(`forma${sufixo}`).value,
        prazo_entrega: document.getElementById(`prazo${sufixo}`).value
    };
}

function dadosValidos(dados) {
    if (!dados.data) {
        alert("Informe a Data do pedido.");
        return false;
    }
    if (!dados.cliente_id || !dados.condicao_pagamento_id || !dados.forma_pagamento_id) {
        alert("Selecione Cliente, Condição de Pagamento e Forma de Pagamento.");
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
    const pedido = pedidosCache.find(p => p.id === id);
    if (!pedido) {
        mostrarErro(new Error("Pedido não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = pedido.id;
    document.getElementById("dataEdit").value = paraDataInput(pedido.data);
    document.getElementById("clienteEdit").value = pedido.cliente_id;
    document.getElementById("condicaoEdit").value = pedido.condicao_pagamento_id;
    document.getElementById("formaEdit").value = pedido.forma_pagamento_id;
    document.getElementById("prazoEdit").value = paraDataInput(pedido.prazo_entrega);

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
    if (!confirm("Deseja excluir este Pedido?")) return;
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
