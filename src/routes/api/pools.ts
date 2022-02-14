
import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let pool = JSON.parse(req.fields.pool);
        console.log(pool);
        let data = await sqlHelper.insertQuery(pool,'pool');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        let data = await sqlHelper.get('pool',[],`where category_id=${req.query.id}`);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}