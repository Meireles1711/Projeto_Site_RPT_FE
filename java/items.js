const API_URL = 'http://localhost:3000/itens';


async function  listar() { 
    




    const res = await fetch(API_URL);
    const formas_p = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    formas_p.forEach(tipo=> {
        tabela.innerHTML +=`
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.pedido_id}</td>
                td>${tipo.produto_id}</td>
                td>${tipo.descricao}</td>
                td>${tipo.valor_unit}</td>
                <td>${tipo.quantidade}</td>
                 <td>${tipo.subtotal}</td>
                
                 <td>
                   <button onclick="abrirEditar(${tipo.id}, '${tipo.pedido_id}', '${tipo.produto_id}', '${tipo.descricao}', '${tipo.valor_unit}', '${tipo.quantidade}', '${tipo.subtotal}')">Editar</button>
                      <button onclick="deletar(${tipo.id})">Excluir</button>
                </td>



            </tr>
        
        `
        
    });
    }
    
    async function criar() {
        const pedido_id = document.getElementById("pedidoAdd").value;
       
        const produto_id= document.getElementById("produtoAdd").value;
       
        const descricao = document.getElementById("descricaoAdd").value;
       

        const valor_unit = document.getElementById("valorAdd").value;

        const quantidade = document.getElementById("quantidadeAdd").value;

        
        const subtotal = document.getElementById("subtotalAdd").value;
       
       

      

        await fetch(API_URL,{
            method: "POST" ,
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({pedido_id,produto_id,descricao,valor_unit,quantidade,subtotal})
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
   
    function abrirEditar(id,pedido_id,produto_id,descricao,valor_unit,quantidade,subtotal){           

        document.getElementById("idEdit").value = id;
        document.getElementById("pedidoEdit").value = pedido_id;
        document.getElementById("produtoEdit").value = produto_id;
        document.getElementById("descricaoEdit").value = descricao;
        document.getElementById("valorEdit").value = valor_unit;
        document.getElementById("quantidadeEdit").value = quantidade;
        document.getElementById("subtotalEdit").value = subtotal;
       
    
    
        document.getElementById("modalEditar").style.display = "flex";
        
    
        
    }

    async function atualizar() {

        
        const id = document.getElementById("idEdit").value;
        const pedido_id = document.getElementById("pedidoEdit").value;
        const produto_id= document.getElementById("produtoEdit").value;
        const descricao = document.getElementById("descricaoEdit").value;
        const valor_unit= document.getElementById("valorEdit").value;
        const quantidade = document.getElementById("quantidadeEdit").value;
        const subtotal = document.getElementById("subtotalEdit").value;
      
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({pedido_id,produto_id,descricao,valor_unit,quantidade,subtotal})
        });
        fecharModal("modalEditar");
        listar();
        
    }

    listar();


    async function deletar(id) {
        if (!confirm("Deseja excluir este Iten Pedido?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
