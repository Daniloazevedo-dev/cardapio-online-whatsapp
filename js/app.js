$(document).ready(function() {
    cardapio.eventos.init();
});

var cardapio = {};
var MEU_CARRINHO = [];

cardapio.eventos = {
    init: () => {
        cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {
        var filtro = MENU[categoria];

        if(!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }
        
        $.each(filtro, (i, e) => {
            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id);

            // Botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp);
            }

            // Paginaçao inicial (8 itens)
            if(!vermais && i < 8) {
                $("#itensCardapio").append(temp);
            }


        });

        $(".container-menu a").removeClass('active');
        $("#menu-" + categoria).addClass('active');
    },
    //Clique no botão de ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; // [menu-][burgers ]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },
    dimunuirQuantidade: (id) => {
        let qntAtual = parseInt($("#qntd-" + id).text());
        if(qntAtual > 0) {
            $("#qntd-" + id).text(qntAtual - 1);
        }
    },
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1);
    },

    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
        if(qntdAtual > 0) {
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            let filtro = MENU[categoria];

            let item = $.grep(filtro, (e, i) => { return e.id === id });

            if(item.length > 0) {

                let existe = $.grep(MEU_CARRINHO, (elemento, index) => { return elemento.id === id });

                if(existe.length > 0) {
                    let indice = MEU_CARRINHO.findIndex((obj) => obj.id == id);
                    MEU_CARRINHO[indice].qntd = MEU_CARRINHO[indice].qntd + qntdAtual;
                } else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }

                alert('Item adicionado ao carrinho.');
                $("#qntd-" + id).text(0);

            }
        }
    }
}

cardapio.templates = {
    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" />
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b >R$ \${preco}</b>                                        
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.dimunuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div> 
    `
}