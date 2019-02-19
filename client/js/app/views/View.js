class View{
    constructor(elemento){
        this._elemento = elemento;
    }
    template(model){
        throw new Error("O Método template precisa ser implementado.")
    }
    update(model){
        this._elemento.innerHTML = this.template(model);
    }

}