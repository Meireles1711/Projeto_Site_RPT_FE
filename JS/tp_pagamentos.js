const API_URL = 'http://localhost:3000/formas';

let formasCache = [];

async function listar() {
    try {
        formasCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        formasCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    formasCache.forEach(tipo => {
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
    const forma = formasCache.find(f => f.id === id);
    if (!forma) {
        mostrarErro(new Error("Registro não encontrado na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = forma.id;
    document.getElementById("descricaoEdit").value = forma.descricao;

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
    if (!confirm("Deseja excluir esta Forma de Pagamento?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        // Erro comum aqui: forma de pagamento em uso por algum pedido (FK RESTRICT).
        mostrarErro(erro);
    }
}

listar();
