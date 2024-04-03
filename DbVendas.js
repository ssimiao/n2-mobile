import * as SQLite from 'expo-sqlite/next'; // npx expo install expo-sqlite
// para instalar:  
//npx expo install expo-sqlite
//https://docs.expo.dev/versions/latest/sdk/sqlite-next/

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbquitanda.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbVendasNew
        (
            codigoVenda text not null,
            codigoProduto text not null,
            quantidade number not null,
            data text not null,
            PRIMARY KEY (codigoVenda, codigoProduto)          
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync() ;
};

export async function obtemTodasVendas() {

    var retorno = []
    var dbCx = await getDbConnection();
    const registros =  await dbCx.getAllAsync('SELECT * FROM tbVendasNew JOIN tbProdutoNew ON tbProdutoNew.codigo = tbVendasNew.codigoProduto');

    for (const registro of registros) {        
        let obj = {
            codigo: registro.codigoVenda,
            codigoProduto: registro.codigoProduto,
            quantidade: registro.quantidade,
            data: registro.data,
            nomeProduto: registro.descricao,
            valorProduto: registro.valor           
        }
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaVenda(carrinho, idVenda, data) {    
    let dbCx = await getDbConnection();    
    carrinho.forEach((venda, index) => {
        console.log(idVenda)
        console.log(venda)
        console.log(data)
        let query = 'insert into tbVendasNew (codigoVenda, codigoProduto, quantidade, data) values (?,?,?,?)';
        let result = dbCx.runSync(query, [idVenda, venda.codigo, venda.quantidade, data])
    })
    await dbCx.closeAsync() ;    
}

export async function alteraProduto(produto) {
    console.log("Atualizando: " + JSON.stringify(produto))
    let dbCx = await getDbConnection();
    let query = 'update tbProdutoNew set descricao=?, valor=?, idCategoria=? where codigoVenda=?';
    const result = await dbCx.runAsync(query, [produto.descricao, produto.valor, produto.idCategoria, produto.codigo]);
    await dbCx.closeAsync() ;
    return result.changes == 1;
}

export async function excluiProduto(id) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutoNew where codigoVenda=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync() ;
    return result.changes == 1;    
}

export async function excluiTodosProdutos() {
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutoNew';    
    await dbCx.execAsync(query);    
    await dbCx.closeAsync() ;
}
