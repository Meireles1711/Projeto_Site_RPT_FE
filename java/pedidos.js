const API_URL = 'http://localhost:3000/pedidos';


async function listar() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Erro ao buscar pedidos");
        }

        const pedidos = await res.json();

        const tabela = document.getElementById("tabelaTipos");
        let html = "";

        pedidos.forEach(tipo => {
            const data = tipo.data ? tipo.data.split("T")[0] : "";
            const prazoEntrega = tipo.prazo_entrega
                ? tipo.prazo_entrega.split("T")[0]
                : "";

                html += `
                <tr>
                    <td>${tipo.id}</td>
                    <td>${data}</td>
                    <td>${tipo.cliente_id}</td>
                    <td>${tipo.condicao_pagamento_id}</td>
                    <td>${tipo.forma_pagamento_id}</td>
                    <td>${prazoEntrega}</td>
                    <td>
                        <button onclick="abrirEditar(
                            ${tipo.id},
                            '${data}',
                            '${tipo.cliente_id}',
                            '${tipo.condicao_pagamento_id}',
                            '${tipo.forma_pagamento_id}',
                            '${prazoEntrega}'
                        )">
                            Editar
                        </button>
                
                        <button onclick="deletar(${tipo.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
                `;
        });

        tabela.innerHTML = html;

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao carregar os pedidos.");
    }
}
     
async function criar() {

    const data = document.getElementById("dataAdd").value;
    const cliente_id = document.getElementById("clienteAdd").value;
    const condicao_pagamento_id = document.getElementById("condicaoAdd").value;
    const forma_pagamento_id = document.getElementById("formaAdd").value;
    const prazo_entrega = document.getElementById("prazoAdd").value;

    // Validação
    if (
        !data ||
        !cliente_id ||
        !condicao_pagamento_id ||
        !forma_pagamento_id ||
        !prazo_entrega
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data,
                cliente_id,
                condicao_pagamento_id,
                forma_pagamento_id,
                prazo_entrega
            })
        });

        if (!res.ok) {
            throw new Error("Erro ao cadastrar pedido.");
        }

        alert("Pedido cadastrado com sucesso!");
        fecharModal("modalAdicionar");
        listar();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar o pedido.");
    }
}

function abrirModalAdicionar() {
    document.getElementById("modalAdicionar").style.display = "flex";
}

function fecharModal(id) {
    document.getElementById(id).style.display = "none";
}

async function atualizar() {

    const id = document.getElementById("idEdit").value;
    const data = document.getElementById("dataEdit").value;
    const cliente_id = document.getElementById("clienteEdit").value;
    const condicao_pagamento_id = document.getElementById("condicaoEdit").value;
    const forma_pagamento_id = document.getElementById("formaEdit").value;
    const prazo_entrega = document.getElementById("prazoEdit").value;

    if (
        !data ||
        !cliente_id ||
        !condicao_pagamento_id ||
        !forma_pagamento_id ||
        !prazo_entrega
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    try {

        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data,
                cliente_id,
                condicao_pagamento_id,
                forma_pagamento_id,
                prazo_entrega
            })
        });

        if (!res.ok) {
            throw new Error("Erro ao atualizar pedido.");
        }

        alert("Pedido atualizado com sucesso!");

        fecharModal("modalEditar");
        listar();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao atualizar o pedido.");
    }
}

    listar();


    async function deletar(id) {
        if (!confirm("Deseja excluir este Pedido?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
    function abrirEditar(id, data, cliente_id, condicao_pagamento_id, forma_pagamento_id, prazo_entrega) {

        document.getElementById("idEdit").value = id;
        document.getElementById("dataEdit").value = data;
        document.getElementById("clienteEdit").value = cliente_id;
        document.getElementById("condicaoEdit").value = condicao_pagamento_id;
        document.getElementById("formaEdit").value = forma_pagamento_id;
        document.getElementById("prazoEdit").value = prazo_entrega;
    
        document.getElementById("modalEditar").style.display = "flex";
    }