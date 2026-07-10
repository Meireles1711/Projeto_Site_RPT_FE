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
                <td>${tipo.descricao}</td>
                  <td>${tipo.unidade}</td>
                  <td>${tipo.valor_unit}</td>
                  <td>${tipo.estoque}</td>
                
                 <td>
                    <button onclick="abrirEditar(${tipo.id},'${tipo.descricao}','${tipo.unidade}','${tipo.valor_unit}','${tipo.estoque}')">Editar</button>
                    <button onclick="deletar(${tipo.id})">Excluir</button>
                </td>



            </tr>
        
        `
        
    });
    }
    
    async function criar() {
        const descricao = document.getElementById("descricaoAdd").value;
        const unidade= document.getElementById("unidadeAdd").value;
        const valor_unit = document.getElementById("valorAdd").value;
        const estoque = document.getElementById("estoqueAdd").value;
       
        await fetch(API_URL,{
            method: "POST" ,
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({descricao,unidade,valor_unit,estoque})
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
   
    function abrirEditar(id,descricao,unidade,valor_unit,estoque) {

        document.getElementById("idEdit").value = id;
        document.getElementById("descricaoEdit").value = descricao;
        document.getElementById("unidadeEdit").value = unidade;
        document.getElementById("valorEdit").value =valor_unit;
        document.getElementById("estoqueEdit").value = estoque;
       
    
    
        document.getElementById("modalEditar").style.display = "flex";
        
    
        
    }

    async function atualizar() {

        
        const id = document.getElementById("idEdit").value;
        const descricao = document.getElementById("descricaoEdit").value;
        const unidade = document.getElementById("unidadeEdit").value;
        const valor_unit = document.getElementById("valorEdit").value;
        const estoque = document.getElementById("estoqueEdit").value;
      
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
        if (!confirm("Deseja excluir este Produto ?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
