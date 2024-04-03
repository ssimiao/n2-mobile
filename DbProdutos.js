import * as SQLite from 'expo-sqlite/next'; // npx expo install expo-sqlite
// para instalar:  
//npx expo install expo-sqlite
//https://docs.expo.dev/versions/latest/sdk/sqlite-next/

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbquitanda.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbProdutoNew
        (
            codigo text not null primary key,
            descricao text not null,
            valor real not null,
            idCategoria number not null          
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync() ;
};

export async function obtemTodosProdutos() {

    var retorno = []
    var dbCx = await getDbConnection();
    const registros =  await dbCx.getAllAsync('SELECT * FROM tbProdutoNew JOIN tbCategoriaNew ON tbCategoriaNew.codigoCategoria = tbProdutoNew.idCategoria');

    for (const registro of registros) {        
        let obj = {
            codigo: registro.codigo,
            descricao: registro.descricao,
            valor: registro.valor,
            idCategoria: registro.idCategoria,
            categoria: registro.descricaoCategoria           
        }
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaProduto(produto) {    
    let dbCx = await getDbConnection();    
    let query = 'insert into tbProdutoNew (codigo, descricao, valor, idCategoria) values (?,?,?,?)';
    const result = await dbCx.runAsync(query, [produto.codigo, produto.descricao, produto.valor, produto.idCategoria]);    
    await dbCx.closeAsync() ;    
    return result.changes == 1;    
}

export async function alteraProduto(produto) {
    console.log("Atualizando: " + JSON.stringify(produto))
    let dbCx = await getDbConnection();
    let query = 'update tbProdutoNew set descricao=?, valor=?, idCategoria=? where codigo=?';
    const result = await dbCx.runAsync(query, [produto.descricao, produto.valor, produto.idCategoria, produto.codigo]);
    await dbCx.closeAsync() ;
    return result.changes == 1;
}

export async function excluiProduto(id) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbProdutoNew where codigo=?';
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
