import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let data = await sqlHelper.insertQuery(JSON.parse(req.fields.judge),'judge_pool_athlete');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        let record = req.query;
        let data = await sqlHelper.get('judge_pool_athlete',[],`where pool_id=${record.pool} and athlete_id=${record.athlete}`);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}