/* =========================================================
   ATENÇÃO — AJUSTE IMPORTANTE NESTA REVISÃO
   Ver comentário completo no topo de cadastro.js: o login
   agora é feito por "nome" (não por e-mail, que não existe
   na tabela `usuarios`) e via chamada real ao backend.

   PENDENTE DE CONFIRMAÇÃO COM O BACKEND (ver relatório):
   - Rota exata (assumi POST http://localhost:3000/login)
   - O que a API devolve no sucesso (usei o próprio nome
     como "sessão"; se o backend usar token JWT, é só trocar
     o que é salvo em sessionStorage abaixo)
   ========================================================= */

const API_URL = 'http://localhost:3000/login';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login');
  const alertBox = document.getElementById('alert-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value;

    if (!nome || !senha) {
      showAlert('Preencha todos os campos.', 'error');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
      });

      if (!res.ok) {
        let mensagem = 'Nome de usuário ou senha incorretos.';
        try {
          const corpo = await res.json();
          mensagem = corpo?.error || corpo?.message || mensagem;
        } catch (_) { /* sem corpo JSON */ }
        showAlert(mensagem, 'error');
        return;
      }

      const dados = await res.json().catch(() => ({}));
      // Guarda a sessão localmente para as telas internas saberem que
      // o usuário está logado. Se o backend passar a usar JWT, troque
      // "dados.nome" por "dados.token" aqui.
      sessionStorage.setItem('nv_sessao', JSON.stringify({ nome: dados.nome ?? nome }));

      showAlert('Login realizado com sucesso! Entrando...', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    } catch (erroDeRede) {
      showAlert('Não foi possível conectar ao servidor. Tente novamente.', 'error');
    }
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }
});
