const API_URL = 'http://localhost:3000/cidades';


async function  listar() { 
    




    const res = await fetch(API_URL);
    const cidades = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    cidades.forEach(tipo=> {
        tabela.innerHTML +=`
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.nome}</td>
                  <td>${tipo.uf}</td>
                
                 <td>
                    <button onclick="abrirEditar(${tipo.id},'${tipo.nome}','${tipo.uf}')">Editar</button>
                    <button onclick="deletar(${tipo.id})">Excluir</button>
                </td>



            </tr>
        
        `
        
    });
    }
    
    async function criar() {
        const nome = document.getElementById("nomeAdd").value;
        const uf = document.getElementById("ufAdd").value;
       
        await fetch(API_URL,{
            method: "POST" ,
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({nome,uf})
        });
        fecharModal("modalAdicionar");
        listar();
    }
    function abrirModalAdicionar(){
        document.getElementById("modalAdicionar").style.display="flex";
    
    }
    function fecharModal(id){
        document.getElementById(id).style.display ="none" ;
        
    }
   
    function abrirEditar(id,nome,uf) {

        document.getElementById("idEdit").value = id;
        document.getElementById("nomeEdit").value = nome;
        document.getElementById("ufEdit").value = uf;
       
    
    
        document.getElementById("modalEditar").style.display = "flex";
        
    
        
    }

    async function atualizar() {

        
        const id = document.getElementById("idEdit").value;
        const nome = document.getElementById("nomeEdit").value;
        const uf = document.getElementById("ufEdit").value;
      
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nome,uf})
        });
        fecharModal("modalEditar");
        listar();
        
    }

    listar();


    async function deletar(id) {
        if (!confirm("Deseja excluir esta Cidade ?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
