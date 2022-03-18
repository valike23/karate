
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
        let data : any= await sqlHelper.get('competition');
        res.json(data);
        
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}

export async function put(req, res) {
    try {
        //set the active competition session.
        let isSet = false;
        let data : any= await sqlHelper.get('competition');
        console.log(data);
        data.forEach(e => {
            if(e.status == 'active'){
                isSet = true;
                req.session.competition = e.id;
            }
        });
       
        if(isSet){
            res.json({msg: 'set'})
        }
        else{
            res.json({msg: 'not set'})
        }
    } catch (error) {
        console.log(error);
        res.json({msg: 'not set'})
    }
}

export async function patch(req, res) {
    try {
        let result: any = await sqlHelper.updateQuery('competition',{status: 'active'}, `where id =${req.query.id}`);
        console.log(result);
        req.session.competition = req.query.id;
        res.json({msg: 'success'})
      
      
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}

