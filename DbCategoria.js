import * as SQLite from 'expo-sqlite/next'; // npx expo install expo-sqlite
// para instalar:  
//npx expo install expo-sqlite
//https://docs.expo.dev/versions/latest/sdk/sqlite-next/

export async function getDbConnection() {
    const cx = await SQLite.openDatabaseAsync('dbquitanda.db');
    return cx;
}

export async function createTable() {    
    const query = `CREATE TABLE IF NOT EXISTS tbCategoriaNew
        (
            codigoCategoria text not null primary key,
            descricaoCategoria text not null
        )`;
    var cx = await getDbConnection();
    await cx.execAsync(query);   
    await cx.closeAsync() ;
};

export async function obtemTodasCategorias() {

    var retorno = []
    var dbCx = await getDbConnection();
    const registros = await dbCx.getAllAsync('SELECT * FROM tbCategoriaNew');
    await dbCx.closeAsync() ;

    for (const registro of registros) {        
        let obj = {
            codigo: registro.codigoCategoria,
            descricao: registro.descricaoCategoria,
        }
        retorno.push(obj);
    }

    return retorno;
}

export async function adicionaCategoria(categoria) {    
    let dbCx = await getDbConnection();    
    console.log(JSON.stringify(categoria))
    let query = 'insert into tbCategoriaNew (codigoCategoria, descricaoCategoria) values (?,?)';
    const result = await dbCx.runAsync(query, [categoria.codigo, categoria.descricao]);    
    await dbCx.closeAsync();    
    return result.changes == 1;    
}

export async function alteraCategoria(categoria) {
    let dbCx = await getDbConnection();
    let query = 'update tbCategoriaNew set descricaoCategoria=? where codigoCategoria=?';
    const result = await dbCx.runAsync(query, [categoria.descricao, categoria.codigo]);
    await dbCx.closeAsync() ;
    return result.changes == 1;
}

export async function excluiCategoria(id) {
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategoriaNew where codigoCategoria=?';
    const result = await dbCx.runAsync(query, id);
    await dbCx.closeAsync() ;
    return result.changes == 1;    
}

export async function excluiTodasCategorias() {
    let dbCx = await getDbConnection();
    let query = 'delete from tbCategoriaNew';    
    await dbCx.execAsync(query);    
    await dbCx.closeAsync() ;
}
