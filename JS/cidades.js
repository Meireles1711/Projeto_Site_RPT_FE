const API_URL = 'http://localhost:3000/cidades';

/* Cache da última listagem vinda da API. Usado para preencher o
   modal de edição sem precisar serializar cada campo dentro do
   onclick do botão "Editar" (o que antes era feito com
   escapeAttr() em cada campo — funcionava, mas era frágil e
   deixava a tabela cheia de string concatenada). Agora o botão
   só carrega o ID, e os dados são lidos daqui. */
let cidadesCache = [];

async function listar() {
    try {
        cidadesCache = await apiFetch(API_URL);
    } catch (erro) {
        mostrarErro(erro);
        cidadesCache = [];
    }

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    cidadesCache.forEach(tipo => {
        tabela.innerHTML += `
            <tr>
                <td>${tipo.id}</td>
                <td>${escapeHtml(tipo.nome)}</td>
                <td>${escapeHtml(tipo.uf)}</td>

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

    const nome = limparEspacos(document.getElementById("nomeAdd").value);
    const uf = somenteLetrasUF(document.getElementById("ufAdd").value);

    if (!nome || uf.length !== 2) {
        alert("Preencha o Nome e uma UF válida (2 letras) antes de salvar.");
        return;
    }

    try {
        await apiFetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, uf })
        });
        form.reset();
        fecharModal("modalAdicionar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

function abrirEditar(id) {
    const cidade = cidadesCache.find(c => c.id === id);
    if (!cidade) {
        mostrarErro(new Error("Cidade não encontrada na lista atual. Atualize a página e tente novamente."));
        return;
    }

    document.getElementById("idEdit").value = cidade.id;
    document.getElementById("nomeEdit").value = cidade.nome;
    document.getElementById("ufEdit").value = cidade.uf;

    document.getElementById("modalEditar").style.display = "flex";
}

async function atualizar() {
    const form = document.getElementById("formEditar");
    if (form && !form.reportValidity()) return;

    const id = document.getElementById("idEdit").value;
    const nome = limparEspacos(document.getElementById("nomeEdit").value);
    const uf = somenteLetrasUF(document.getElementById("ufEdit").value);

    if (!nome || uf.length !== 2) {
        alert("Preencha o Nome e uma UF válida (2 letras) antes de salvar.");
        return;
    }

    try {
        await apiFetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, uf })
        });
        fecharModal("modalEditar");
        await listar();
    } catch (erro) {
        mostrarErro(erro);
    }
}

async function deletar(id) {
    if (!confirm("Deseja excluir esta cidade?")) return;
    try {
        await apiFetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
    } catch (erro) {
        // Erro comum aqui: cidade com clientes vinculados (FK RESTRICT).
        mostrarErro(erro);
    }
}

listar();
