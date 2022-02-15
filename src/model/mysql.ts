import { ConnectionConfig, createConnection } from 'mysql';


export interface IjoinTable {
    name: string;
    foriegnKeyColumn: string;
    primaryKeyColumn: string;
}

export class SqlHelper {
    dbConfig: ConnectionConfig;
    constructor(config: ConnectionConfig) {
        this.dbConfig = config;
    }
    insertQuery(data: any, table: string) {

        return new Promise((resolve, reject) => {
            try {
                const conn = createConnection(this.dbConfig);
                conn.query(`insert into ${table} set ?`, data, (err, result) => {
                    if (err) {
                       reject(err);
                    }
                    console.log(result);
                    resolve(result)

                })
            } catch (error) {
                console.log(error)
                reject(error);
            }

        })

    }
    get(table: string, columns: Array<string>=[], userQuery: string = '') {
        return new Promise((resolve, reject) => {
            try {
                let query = '';
                if(columns.length > 0){
                    query = 'SELECT ';
                    columns.forEach((e,i)=>{
                        if(i == 0){
                            query += `${e}`;
                        }else{
                            query += ` , ${e}`;
                        }
                    })
                }
                else{
                    query = "SELECT * "
                }
                query += ` FROM ${table} `;
                query += userQuery;
                console.log(query);
                const conn = createConnection(this.dbConfig);
                conn.query(query, (err, result) => {
                    if (err) {
                       reject(err);
                    }
                    console.log(result);
                    resolve(result);
                })
            } catch (error) {
                console.log(error)
                reject(error);
            }

        })
    }
    updateQuery(table: string, data: any, whereClause: string) {
        return new Promise((resolve, reject)=> {
            let query = `update ${table} set `;

            Object.keys(data).forEach((e,i)=>{
                
                query += `${e} = `;
                if(typeof(data[e]) == 'string'){
                    query += `'${data[e]}' `
                }
                else{
                    query += `${data[e]}`
                }
                if(Object.keys(data).length > i + 1){
                    query += ','
                }
                

            })
            query += `  ${whereClause}`;
            console.log(query);
            try {
                const conn = createConnection(this.dbConfig);
                conn.query(query,(err, result)=>{
                    if(err){
                        throw(err);
                    }
                    resolve(result);
                });

            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }
    innerjoin(table: string,  otherTables: Array<IjoinTable>, columns: Array<string>=[], userQuery: string = '') {
        return new Promise((resolve, reject) => {
            try {
                let query = '';
                if(columns.length > 0){
                    query = 'SELECT ';
                    columns.forEach((e,i)=>{
                        if(i == 0){
                            query += `${e}`;
                        }else{
                            query += ` , ${e}`;
                        }
                    })
                }
                else{
                    query = "SELECT * "
                }
                query += ` FROM  `;
               for (let index = 0; index < otherTables.length; index++) {
                   query += `(`;
                   
               }
                query += ` ${table}  `;
                for (let index = 0; index < otherTables.length; index++) {
                    query += `INNER JOIN ${otherTables[index].name} ON ${table}.${otherTables[index].foriegnKeyColumn} = ${otherTables[index].name}.${otherTables[index].primaryKeyColumn})`;
                    
                }
                query += userQuery;
                console.log(query);
                const conn = createConnection(this.dbConfig);
                conn.query(query, (err, result) => {
                    if (err) {
                       reject(err);
                    }
                    console.log(result);
                    resolve(result);
                })
            } catch (error) {
                console.log(error)
                reject(error);
            }

        })
    }
}