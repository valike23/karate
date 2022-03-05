
import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let data = await sqlHelper.insertQuery(JSON.parse(req.fields.competition),'competition');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        let data = await sqlHelper.get('competition');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}

