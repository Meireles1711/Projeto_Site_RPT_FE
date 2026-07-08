const API_URL = 'http://localhost:3000/pedidos';


async function  listar() { 
    




    const res = await fetch(API_URL);
    const formas_p = await res.json();

    const tabela = document.getElementById("tabelaTipos");
    tabela.innerHTML = "";

    formas_p.forEach(tipo=> {
        tabela.innerHTML +=`
            <tr>
                <td>${tipo.id}</td>
                <td>${tipo.data}</td>
                td>${tipo.cliente_id}</td>
                td>${tipo.condicao_pagamento_id}</td>
                td>${tipo.forma_pagamento_id}</td>
                <td>${tipo.prazo_entrega}</td>
                
                 <td>
                    <button onclick="abrirEditar(${tipo.id},'${tipo.data}''${tipo.cliente_id}''${tipo.condicao_pagamento_id}'
                    '${tipo.forma_pagamento_id}''${tipo.prazo_entrega}')">Editar</button>
                    <button onclick="deletar(${tipo.id})">Excluir</button>
                </td>



            </tr>
        
        `
        
    });
    }
    
    async function criar() {
        const data = document.getElementById("dataAdd").value;
       
        const cliente_id= document.getElementById("clienteAdd").value;
       
        const condicao_pagamento_id = document.getElementById("condicaoAdd").value;
       

        const forma_pagamento_id = document.getElementById("formaAdd").value;

        const prazo_entrega = document.getElementById("prazoAdd").value;
       
       

      

        await fetch(API_URL,{
            method: "POST" ,
            headers:{"Content-type": "application/json"},
            body:JSON.stringify({data,cliente_id,condicao_pagamento_id,forma_pagamento_id,prazo_entrega})
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
   
    function abrirEditar(id,data,cliente_id,condicao_pagamento_id,forma_pagamento_id,prazo_entrega){           

        document.getElementById("idEdit").value = id;
        document.getElementById("dataEdit").value = data;
        document.getElementById("clienteEdit").value = cliente_id;
        document.getElementById("condicaoEdit").value = condicao_pagamento_id;
        document.getElementById("formaEdit").value = forma_pagamento_id;
        document.getElementById("prazoEdit").value = prazo_entrega;
       
    
    
        document.getElementById("modalEditar").style.display = "flex";
        
    
        
    }

    async function atualizar() {

        
        const id = document.getElementById("idEdit").value;
        const data = document.getElementById("dataEdit").value;
        const cliente_id= document.getElementById("clienteEdit").value;
        const condicao_pagamento_id = document.getElementById("condicaoEdit").value;
        const forma_pagamento_id = document.getElementById("formaEdit").value;
        const prazo_entrega = document.getElementById("prazoEdit").value;
      
        await fetch(`${API_URL}/${id}`,{
            method:"PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({data,cliente_id,condicao_pagamento_id,forma_pagamento_id,prazo_entrega})
        });
        fecharModal("modalEditar");
        listar();
        
    }

    listar();


    async function deletar(id) {
        if (!confirm("Deseja excluir este Pedido?")) return;
        await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
    });
        
    listar();}
    
    
