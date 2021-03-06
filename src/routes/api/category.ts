
import type { Icategory } from '../../model/application';
import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let category: Icategory = JSON.parse(req.fields.category);
        category.competition_id = req.session.competition;
        let data = await sqlHelper.insertQuery(category,'category');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        console.log(req.session);
        let data = await sqlHelper.get('category',[], `where competition_id =${req.session.competition}`);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
export async function put (req, res) {
    try {
        if(req.query.status == 'deactivate'){
            let data = await sqlHelper.updateQuery('category',{active: 0}, `where id=${req.query.id}`);
        res.json(data);
        }
        else{
            let data = await sqlHelper.updateQuery('category',{active: 1}, `where id=${req.query.id}`);
        res.json(data);
        }
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
export async function patch (req, res) {
    try {
        let data = await sqlHelper.get('category',['id'],`where active=1`);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
