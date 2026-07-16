const API_URL = "http://localhost:3000/clientes";

// ===================== LISTAR =====================
async function listar() {
    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            throw new Error("Erro ao buscar clientes.");
        }

        const clientes = await res.json();

        const tabela = document.getElementById("tabelaTipos");
        tabela.innerHTML = "";

        clientes.forEach(cliente => {
            tabela.innerHTML += `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.endereco}</td>
                    <td>${cliente.bairro}</td>
                    <td>${cliente.cep}</td>
                    <td>${cliente.cidade_id}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.observacoes}</td>

                    <td>
                        <button onclick='abrirEditar(
                            ${cliente.id},
                            ${JSON.stringify(cliente.nome)},
                            ${JSON.stringify(cliente.endereco)},
                            ${JSON.stringify(cliente.bairro)},
                            ${JSON.stringify(cliente.cep)},
                            ${JSON.stringify(cliente.cidade_id)},
                            ${JSON.stringify(cliente.cpf)},
                            ${JSON.stringify(cliente.email)},
                            ${JSON.stringify(cliente.telefone)},
                            ${JSON.stringify(cliente.observacoes)}
                        )'>
                            Editar
                        </button>

                        <button onclick="deletar(${cliente.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar os clientes.");
    }
}

// ===================== CRIAR =====================
async function criar() {

    const nome = document.getElementById("nomeAdd").value.trim();
    const endereco = document.getElementById("enderecoAdd").value.trim();
    const bairro = document.getElementById("bairroAdd").value.trim();
    const cep = document.getElementById("cepAdd").value.trim();
    const cidade_id = document.getElementById("cidadeAdd").value;
    const cpf = document.getElementById("cpfAdd").value.trim();
    const email = document.getElementById("emailAdd").value.trim();
    const telefone = document.getElementById("telefoneAdd").value.trim();
    const observacoes = document.getElementById("observacoesAdd").value.trim();

    if (
        !nome ||
        !endereco ||
        !bairro ||
        !cep ||
        !cidade_id ||
        !cpf ||
        !email ||
        !telefone
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                endereco,
                bairro,
                cep,
                cidade_id,
                cpf,
                email,
                telefone,
                observacoes
            })
        });

        if (!res.ok) {
            throw new Error();
        }

        alert("Cliente cadastrado com sucesso!");

        fecharModal("modalAdicionar");
        listar();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar cliente.");
    }
}

// ===================== ABRIR MODAL =====================
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
    document.getElementById("observacoesEdit").value = observacoes;

    document.getElementById("modalEditar").style.display = "flex";
}

// ===================== ATUALIZAR =====================
async function atualizar() {

    const id = document.getElementById("idEdit").value;
    const nome = document.getElementById("nomeEdit").value.trim();
    const endereco = document.getElementById("enderecoEdit").value.trim();
    const bairro = document.getElementById("bairroEdit").value.trim();
    const cep = document.getElementById("cepEdit").value.trim();
    const cidade_id = document.getElementById("cidadeEdit").value;
    const cpf = document.getElementById("cpfEdit").value.trim();
    const email = document.getElementById("emailEdit").value.trim();
    const telefone = document.getElementById("telefoneEdit").value.trim();
    const observacoes = document.getElementById("observacoesEdit").value.trim();

    if (
        !nome ||
        !endereco ||
        !bairro ||
        !cep ||
        !cidade_id ||
        !cpf ||
        !email ||
        !telefone
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                endereco,
                bairro,
                cep,
                cidade_id,
                cpf,
                email,
                telefone,
                observacoes
            })
        });

        if (!res.ok) {
            throw new Error();
        }

        alert("Cliente atualizado com sucesso!");

        fecharModal("modalEditar");
        listar();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao atualizar cliente.");
    }
}

// ===================== DELETAR =====================
async function deletar(id) {

    if (!confirm("Deseja excluir este cliente?")) {
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error();
        }

        alert("Cliente excluído com sucesso!");
        listar();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao excluir cliente.");
    }
}

function fecharModal(idModal) {
    document.getElementById(idModal).style.display = "none";
}
function abrirModalAdicionar() {
    document.getElementById("modalAdicionar").style.display = "flex";
}
// ===================== INICIAR =====================
listar();
