const API_URL = 'http://localhost:3000/pedidos';
const CLIENTES_URL = 'http://localhost:3000/clientes';
const CONDICAO_URL = 'http://localhost:3000/condicao';
const FORMAS_URL = 'http://localhost:3000/formas';

let clientesCache = [];
let condicoesCache = [];
let formasCache = [];

async function carregarListasRelacionadas() {
    try {
        const [resClientes, resCondicoes, resFormas] = await Promise.all([
            fetch(CLIENTES_URL),
            fetch(CONDICAO_URL),
            fetch(FORMAS_URL)
        ]);
        clientesCache = await resClientes.json();
        condicoesCache = await resCondicoes.json();
        formasCache = await resFormas.json();

        preencherSelect("clienteAdd", clientesCache, "Selecione um cliente...", c => c.nome);
        preencherSelect("clienteEdit", clientesCache, "Selecione um cliente...", c => c.nome);
        preencherSelect("condicaoAdd", condicoesCache, "Selecione...", c => c.descricao);
        preencherSelect("condicaoEdit", condicoesCache, "Selecione...", c => c.descricao);
        preencherSelect("formaAdd", formasCache, "Selecione...", f => f.descricao);
        preencherSelect("formaEdit", formasCache, "Selecione...", f => f.descricao);
    } catch (e) {
        console.error("Não foi possível carregar clientes/condições/formas:", e);
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

async function listar() {

    const res = await fetch(API_URL);
    const pedidos = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    pedidos.forEach(tipo => {
        const nomeCliente = clientesCache.find(c => c.id == tipo.cliente_id)?.nome ?? tipo.cliente_id;
        const descCondicao = condicoesCache.find(c => c.id == tipo.condicao_pagamento_id)?.descricao ?? tipo.condicao_pagamento_id;
        const descForma = formasCache.find(f => f.id == tipo.forma_pagamento_id)?.descricao ?? tipo.forma_pagamento_id;
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.data}</td>
                <td>${nomeCliente}</td>
                <td>${descCondicao}</td>
                <td>${descForma}</td>
                <td>${tipo.prazo_entrega}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id},'${tipo.data}','${tipo.cliente_id}','${tipo.condicao_pagamento_id}','${tipo.forma_pagamento_id}','${tipo.prazo_entrega}')">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `
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

function abrirEditar(id, data, cliente_id, condicao_pagamento_id, forma_pagamento_id, prazo_entrega) {
    document.getElementById("idEdit").value = id;
    document.getElementById("dataEdit").value = data;
    document.getElementById("clienteEdit").value = cliente_id;
    document.getElementById("condicaoEdit").value = condicao_pagamento_id;
    document.getElementById("formaEdit").value = forma_pagamento_id;
    document.getElementById("prazoEdit").value = prazo_entrega;

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
    if (!confirm("Deseja excluir este Pedido?")) return;
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
