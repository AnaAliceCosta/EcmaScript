class NegociacaoController {
    constructor() {
        let $ = document.querySelector.bind(document);
        this._inputQuantidade = $("#quantidade");
        this._inputData = $("#data");
        this._inputValor = $("#valor");

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($("#negociacoes-view")),
            'adiciona', 'esvazia');
        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($("#negociacoes-mensagem")), 'texto');


        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .then(negociacoes =>
                negociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(erro => {
                console.log(erro)
                this._mensagem.texto = erro;
            });
    }



    adiciona(event) {
        event.preventDefault();
        ConnectionFactory
            .getConnection()
            .then(connection => {
                let negociacao = this._criaNegociacao();
                new NegociacaoDao(connection)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = "Negociacao adicionada com sucesso";
                        this._limpaFormulario();
                    })
            })
            .catch(erro => this.mensagem.texto = erro);

    }
    apaga() {
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro =>
                this._listaNegociacoes.mensagem.texto = erro);

    }
    importaNegociacoes() {
        let service = new NegociacaoService();

        Promise.all([
            service.obterNegociacoesDaSemana(),
            service.obterNegociacoesDaSemanaAnterior(),
            service.obterNegociacoesDaSemanaRetrasada()]
        ).then(negociacoes => {
            negociacoes
                .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
                .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = "Negociacoes Adicionadas com Sucesso"
        }).catch(erro => this._mensagem.texto = erro);

    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }
    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();

    }
}