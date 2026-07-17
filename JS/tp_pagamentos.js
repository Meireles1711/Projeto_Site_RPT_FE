const API_URL = 'http://localhost:3000/formas';


async function  listar() { 
    




    const res = await fetch(API_URL);
    const formas_p = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    formas_p.forEach(tipo=> {
        tabela.innerHTML +=`
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.descricao}</td>
                
                 <td>
                    <button onclick="abrirEditar(${tipo.id},'${tipo.descricao}')">Editar</button>
                    <button onclick="deletar(${tipo.id})">Excluir</button>
                </td>



            </tr>
        
        `
        
    });
    }
    
    async function criar() {
        const descricao = document.getElementById("descricaoAdd").value;
       
        await fetch(API_URL,{
            method: "POST" ,
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({descricao})
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
   
    function abrirEditar(id,descricao) {

        document.getElementById("idEdit").value = id;
        document.getElementById("descricaoEdit").value = descricao;
       
    
    
        document.getElementById("modalEditar").style.display = "flex";
        
    
        
    }

    async function atualizar() {

        
        const id = document.getElementById("idEdit").value;
        const descricao = document.getElementById("descricaoEdit").value;
      
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({descricao})
        });
        fecharModal("modalEditar");
        listar();
        
    }

    listar();


    async function deletar(id) {
        if (!confirm("Deseja excluir esta Forma de Pagamento ?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
