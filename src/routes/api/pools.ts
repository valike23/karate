
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
      if(req.query.status == 'available'){
        let data = await sqlHelper.get('pool',[],`where category_id=${req.query.id} and active_time IS NULL`);
        res.json(data);
      }
      else{
        let data = await sqlHelper.get('pool',[],`where category_id=${req.query.id}`);
        res.json(data);
      }
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
export async function patch (req, res) {
    try {
        //get active category

        let result = await sqlHelper.get('category',['id'],`where active_time`) as unknown as any[];
        if(result.length > 0 ){
            let data = await sqlHelper.get('pool',[],`where category_id=${result[0].id} AND active_time IS NULL`);
            res.json(data);
        }
        else{
            res.json([]);
        }
       
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}