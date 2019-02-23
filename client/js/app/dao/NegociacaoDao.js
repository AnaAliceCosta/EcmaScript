class NegociacaoDao{
    constructor(connection){
        this._connection = connection;
        this._store = 'negociacoes';
        console.log('criado dao')
    }
    
    adiciona(negociacao){
        return new Promise((resolve,reject)=>{
            let request = this._connection
                .transaction([this._store],'readwrite')
                .objectStore(this._store)
                .add(negociacao);
                console.log('passou aqui');
            request.onsuccess = e =>{
                resolve();
            }
            request.onerror = e =>{
                console.log(e.target.erorr);
                reject('Nao foi possivel adicionar negociação');
            }
        });
    }
}