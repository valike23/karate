import type { ConnectionConfig } from 'mysql';

let db4free: ConnectionConfig = {
    host: 'db4free.net',
    password: 'bumblebee2021',
    user: 'saleodb',
    database: 'saleodb'

}
let local: ConnectionConfig = {
    host: 'localhost',
    password: '',
    user: 'root',
    database: 'kata2'
}


 export let dbconfig: ConnectionConfig = local;

 export let cryptoSecret = 'saleosecret';