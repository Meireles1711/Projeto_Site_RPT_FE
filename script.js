// Função para criar um usuário
async function createUser(userData) {
    try {
        const response = await fetch('https://sua-api.com/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        console.log('Usuário criado:', data);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

// Função para editar um usuário
async function editUser(userId, updatedData) {
    try {
        const response = await fetch(`https://sua-api.com/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        const data = await response.json();
        console.log('Usuário atualizado:', data);
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
    }
}

// Função para excluir um usuário
async function deleteUser(userId) {
    try {
        const response = await fetch(`https://sua-api.com/usuarios/${userId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Usuário excluído com sucesso');
        } else {
            console.error('Erro ao excluir usuário');
        }
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
    }
}

// Exemplo de uso
const novoUsuario = { nome: 'João', email: 'joao@email.com' };
createUser(novoUsuario);

const usuarioAtualizado = { nome: 'João Silva' };
editUser(1, usuarioAtualizado);

deleteUser(1);