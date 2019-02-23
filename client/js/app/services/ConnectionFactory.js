var ConnectionFactory =(function(){

    const stores = ['negociacoes'];
    const version = 3;
    const dbName = 'aluraframe';
    
    var connection = null;
    
    var close = null;
    
    return class ConnectionFactory{
        constructor(){
            throw new Error("esta classe nao pode ser instanciada");
        }
        static getConnection(){
            return new Promise((resolve,reject)=>{
                let openRequert = window.indexedDB.open(dbName,version);
                openRequert.onupgradeneeded = e =>{
                    ConnectionFactory._createStores(e.target.result);
                };
                openRequert.onsuccess = e =>{
                    if(! connection) {
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close  = function(){ throw new Error("voce nao pode encerrar esta conexao diretamente")};
                    }
                    resolve(connection);
                };
                
                openRequert.onerror = e =>{
                    console.log(e.target.error);
                    reject(e.target.error.name);
                    
                }
            });
        }
        
        static _createStores(connection){
            stores.forEach(store=>{
                if (connection.objectStoreNames.contains(store)) 
                    connection.deleteObjectStore(store); 
                connection.createObjectStore(store,{autoincrement: true});
            });
    
        }
        static closeConnection(){
            if(connection){
                close();
                connection = null;
            }
        }
    }
})();
