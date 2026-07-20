/* =========================================================
   ATENÇÃO — AJUSTE IMPORTANTE NESTA REVISÃO

   O arquivo original salvava o cadastro inteiro no
   localStorage do navegador (senha em texto puro, sem
   nenhuma chamada à API). Isso NÃO tinha nenhuma ligação
   com a tabela `usuarios` do banco de dados enviado.

   Além disso, a tabela `usuarios` só tem as colunas:
     id, nome (único), senha_hash, criado_em
   ou seja, não existe coluna de e-mail — o login/cadastro
   real só pode ser feito por "nome".

   Por isso, esta versão:
   - Envia { nome, senha } para o backend (POST /usuarios).
   - Não faz mais nenhuma senha ficar salva no navegador.
   - Deixa a criação do hash (senha_hash) por conta do
     backend (é lá que a senha deve ser transformada com
     bcrypt ou similar — nunca no front-end).

   PENDENTE DE CONFIRMAÇÃO COM O BACKEND (ver relatório):
   - Rota exata (assumi POST http://localhost:3000/usuarios)
   - Formato de resposta em caso de erro (ex.: nome já existe)
   ========================================================= */

const API_URL = 'http://localhost:3000/usuarios';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  const alertBox = document.getElementById('alert-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;

    if (!nome || !senha || !confirmarSenha) {
      showAlert('Preencha todos os campos.', 'error');
      return;
    }
    if (senha.length < 6) {
      showAlert('A senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }
    if (senha !== confirmarSenha) {
      showAlert('As senhas não coincidem.', 'error');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, senha })
      });

      if (!res.ok) {
        let mensagem = 'Não foi possível concluir o cadastro.';
        try {
          const corpo = await res.json();
          mensagem = corpo?.error || corpo?.message || mensagem;
        } catch (_) { /* sem corpo JSON */ }
        showAlert(mensagem, 'error');
        return;
      }

      showAlert('Cadastro realizado com sucesso! Redirecionando...', 'success');
      form.reset();
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    } catch (erroDeRede) {
      showAlert('Não foi possível conectar ao servidor. Tente novamente.', 'error');
    }
  });

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
  }
});
