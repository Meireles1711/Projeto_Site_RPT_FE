const modal = document.getElementById("modalCadastro");

const btnAbrir = document.getElementById("abrirCadastro");
const btnFechar = document.getElementById("fecharCadastro");

btnAbrir.addEventListener("click", () => {
    modal.style.display = "flex";
});

btnFechar.addEventListener("click", () => {
    modal.style.display = "none";
});

