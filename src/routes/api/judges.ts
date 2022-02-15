import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let data = await sqlHelper.insertQuery(JSON.parse(req.fields.judge),'judges');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        let data = await sqlHelper.get('judges');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
export async function put (req, res) {
    try {
        let data: any[] = await sqlHelper.get('judges',[], 
        `where name='${req.query.name}' and password='${req.query.password}'`) as unknown as any[];
        if(data.length > 0){
            let response = {data: data[0], result: 1};
            res.json(response);
        }
        else{
            let response = {data: {}, result: 0};
            res.json(response);
        }
        
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
