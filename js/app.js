$(document).ready(function() {
    cardapio.eventos.init();
});

var cardapio = {};
var MEU_CARRINHO = [];
var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 5;
var MEU_ENDERECO = null;

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

                cardapio.metodos.mensagem('Item adicionado ao carrinho.', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgTotal();
            }
        }
    },

    atualizarBadgTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd;
        })

        if(total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho ").removeClass('hidden');
        } else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho ").addClass('hidden');
        }

        $(".badge-total-carrinho").text(total);
    },
    abrirCarrinho: (abrir) => {
        if(abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        } else {
            $("#modalCarrinho").addClass('hidden');
        }
    },
    carregarEtapa: (etapa) => {
        if(etapa === 1) {
            $('#lblTituloEtapa').text('Seu Carrinho:');
            $('#itensCarrinho').removeClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');

            $('#btnEtapaPedido').removeClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnVoltar').addClass('hidden');
        }

        if(etapa === 2) {
            $('#lblTituloEtapa').text('Endereço de Entrega:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').removeClass('hidden');
            $('#resumoCarrinho').addClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').removeClass('hidden');
            $('#btnEtapaResumo').addClass('hidden');
            $('#btnVoltar').removeClass('hidden');
        }

        if(etapa === 3) {
            $('#lblTituloEtapa').text('Resumo do Pedido:');
            $('#itensCarrinho').addClass('hidden');
            $('#localEntrega').addClass('hidden');
            $('#resumoCarrinho').removeClass('hidden');

            $('.etapa').removeClass('active');
            $('.etapa1').addClass('active');
            $('.etapa2').addClass('active');
            $('.etapa3').addClass('active');

            $('#btnEtapaPedido').addClass('hidden');
            $('#btnEtapaEndereco').addClass('hidden');
            $('#btnEtapaResumo').removeClass('hidden');
            $('#btnVoltar').removeClass('hidden');
        }
    },
    voltarEtapa: () => {
        let etapa = $('.etapa.active').length;
        cardapio.metodos.carregarEtapa(etapa - 1);  
    },
    carregarCarrinho: () => {
        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0) {
            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);

                if((i + 1) === MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores(); 
                }
            });
        } else {
            $("#itensCarrinho").html('<p class="carrinho-vazio" ><i class="fas fa-shopping-bag"></i> Seu carrinho está vazio.</p>');
            cardapio.metodos.carregarValores(); 
        }
    },
    dimunuirQuantidadeCarrinho: (id) => {
        let qntAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntAtual - 1);
        } else {
            cardapio.metodos.removerItemCarrinho(id);
        }
    },
    aumentarQuantidadeCarrinho: (id) => {
        let qntAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntAtual + 1);
    },
    removerItemCarrinho: (id) => {
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (elemento, index) => { return elemento.id !== id });

        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgTotal();
    },
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
        MEU_CARRINHO[objIndex].qntd = qntd;

        cardapio.metodos.atualizarBadgTotal();
        cardapio.metodos.carregarValores();
    },
    carregarValores: () => {
        
        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) === MEU_CARRINHO.length) {
                $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }
        });    

    },
    carregarEndereco: () => {
        if(MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.');
            return;
        }

        cardapio.metodos.carregarEtapa(2);
    },
    buscarCep: () => {

        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != "") {
            var validaCep = /^[0-9]{8}$/;
            

            if(validaCep.test(cep)) {

                $.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`, function(dados) {
                    if(!("erro" in dados)) {
                        console.log(dados);
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);

                        $("#txtNumero").focus();
                    } else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }
                });
                
            } else {
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        } else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }
    },
    resumoPedido: () => {
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();

        if(cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }
        if(endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }
        if(numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o número, por favor.');
            $("#txtNumero").focus();
            return;
        }
        if(bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }
        if(cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }
        if(uf === '-1') {
            cardapio.metodos.mensagem('Informe o estado, por favor.');
            $("#ddlUf").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            numero: numero,
            complemento: complemento,
            bairro: bairro,
            cidade: cidade,
            uf: uf
        }

        cardapio.metodos.carregarEtapa(3);
    }
    ,
    mensagem: (texto, cor='red', tempo=3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}" >${texto} </div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown').addClass('fadeOutUp');
            $("#msg-" + id).addClass('fadeOutUp');

            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);

            }, tempo);
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
    `,
    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-logo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.dimunuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>   
    `
}