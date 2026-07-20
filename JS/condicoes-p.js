const API_URL = 'http://localhost:3000/condicao';

let condicoesCache = [];

async function listar() {
    try {
        condicoesCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        condicoesCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    condicoesCache.forEach(tipo => {
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(tipo.descricao)}</td>

                <td>
                    <button class="editar" onclick="abrirEditar(${tipo.id})">Editar</button>
                    <button class="excluir" onclick="deletar(${tipo.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

async function criar() {
    const form = document.getElementById("formAdicionar");
    if (form && !form.reportValidity()) return;

    const descricao = limparEspacos(document.getElementById("descricaoAdd").value);
    if (!descricao) {
        alert("A Descrição é obrigatória.");
        return;
    }

    try {
        await apiFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descricao })
        });
        form.reset();
        fecharModal("modalAdicionar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function abrirEditar(id) {
    const condicao = condicoesCache.find(c => c.id === id);
    if (!condicao) {
        mostrarErro(new Error("Registro não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = condicao.id;
    document.getElementById("descricaoEdit").value = condicao.descricao;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
    const descricao = limparEspacos(document.getElementById("descricaoEdit").value);
    if (!descricao) {
        alert("A Descrição é obrigatória.");
        return;
    }

    try {
        await apiFetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descricao })
        });
        fecharModal("modalEditar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function deletar(id) {
    if (!confirm("Deseja excluir esta Condição de Pagamento?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        // Erro comum aqui: condição em uso por algum pedido (FK RESTRICT).
        mostrarErro(erro);
    }
}

listar();
