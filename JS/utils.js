/* =========================================================
   UTILITÁRIOS COMPARTILHADOS — NV STORE
   Incluir este arquivo ANTES do script de cada página
   (ex: <script src="../js/utils.js"></script>)

   Correções desta revisão:
   - Centralizadas aqui funções que estavam DUPLICADAS em
     vários arquivos (limparEspacos, fecharModal,
     abrirModalAdicionar, preencherSelect, somenteNumeros).
   - Adicionado apiFetch(): wrapper único para todas as
     chamadas à API, com tratamento de erro de rede/HTTP
     (antes, nenhuma tela tratava falha de requisição —
     um erro 500 ou a API fora do ar quebrava a página
     silenciosamente).
   ========================================================= */

/* Escapa texto que vai direto pro innerHTML (nome, descrição, etc.)
   Evita que um "&", "<" ou ">" no dado quebre a tabela. */
function escapeHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/* Escapa texto que vai dentro de onclick="funcao('valor')".
   Sem isso, um nome/descrição com aspas (ex: Padaria "Pão Quente")
   quebra o HTML e o botão Editar para de funcionar.
   OBS: mesmo com essa função, o ideal é evitar montar onclick com
   dados vindos do banco — por isso, nas telas de listagem, os
   botões Editar/Excluir agora recebem só o ID (número) e buscam
   o restante dos dados em um cache local (ver cada <pagina>.js). */
function escapeAttr(valor) {
    let s = String(valor ?? '');
    s = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    s = s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return s;
}

/* Remove espaços das pontas. Usado em quase todo formulário. */
function limparEspacos(v) {
    return (v ?? '').toString().trim();
}

/* Mantém só dígitos (CPF, telefone, CEP). */
function somenteNumeros(v) {
    return (v ?? '').toString().replace(/\D/g, '');
}

/* Mantém só letras, maiúsculas, no máximo 2 (UF). */
function somenteLetrasUF(v) {
    return (v ?? '').toString().replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2);
}

/* Abre o modal de cadastro. Em todas as telas o modal de
   "adicionar" tem sempre o id fixo "modalAdicionar". */
function abrirModalAdicionar() {
    const modal = document.getElementById("modalAdicionar");
    if (modal) modal.style.display = "flex";
}

/* Fecha qualquer modal pelo id. */
function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}

/* Preenche um <select> a partir de uma lista vinda da API,
   preservando o valor selecionado (útil ao recarregar dados). */
function preencherSelect(selectId, lista, placeholder, rotulo) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const valorAtual = select.value;
    select.innerHTML = `<option value="" selected disabled>${escapeHtml(placeholder)}</option>`;
    (lista ?? []).forEach(item => {
        select.innerHTML += `<option value="${item.id}">${escapeHtml(rotulo(item))}</option>`;
    });
    if (valorAtual) select.value = valorAtual;
}

/* =========================================================
   apiFetch — wrapper único para chamadas à API.

   Por que isso importa: antes, cada tela chamava fetch()
   diretamente e nunca verificava se a resposta veio com
   erro (res.ok). Se o backend respondesse 400/500 (ex.:
   CPF duplicado, cidade com clientes não pode ser excluída,
   etc.), o front simplesmente travava ou seguia como se
   tivesse dado certo. Agora todo POST/PUT/DELETE/GET passa
   por aqui, e qualquer erro vira uma mensagem legível pro
   usuário em vez de um erro silencioso no console.
   ========================================================= */
async function apiFetch(url, options) {
    let res;
    try {
        res = await fetch(url, options);
    } catch (erroDeRede) {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua internet ou se a API está no ar.");
    }

    if (!res.ok) {
        let mensagem = `Erro ${res.status} ao processar a solicitação.`;
        try {
            const corpo = await res.json();
            if (corpo?.error) mensagem = corpo.error;
            else if (corpo?.message) mensagem = corpo.message;
        } catch (_) {
            // resposta de erro sem corpo JSON: mantém mensagem genérica
        }
        throw new Error(mensagem);
    }

    if (res.status === 204) return null; // sem conteúdo (comum em DELETE)

    try {
        return await res.json();
    } catch (_) {
        return null;
    }
}

/* Mostra um erro de forma simples e consistente em toda a aplicação.
   Centralizado aqui para que, no futuro, baste trocar esta função
   por um toast/alerta visual sem precisar mexer em cada tela. */
function mostrarErro(erro) {
    console.error(erro);
    alert(erro?.message || "Ocorreu um erro inesperado. Tente novamente.");
}
