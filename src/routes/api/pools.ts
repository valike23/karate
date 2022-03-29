
import type { Icategory, Ipool } from '../../model/application';
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

        let result = await sqlHelper.get('category',['id'],`where active=1 and competition_id=${req.session.competition}`) as unknown as any[];
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
export async function put(req, res){
    let competitionId = req.query.id;
    let categories: any= await sqlHelper.get('category',['id'],`where competition_id=${competitionId}`);
    let promises = [];
    categories.forEach((category)=>{
        promises.push(sqlHelper.get('pool',[],`where category_id = ${category.id} `));
    });
  let pools = await Promise.all(promises);
  console.log(pools);

  let mypools:Ipool[] = [];
  pools.forEach((pool)=>{
    pool.forEach((p)=>{
        mypools.push(p);
    })
  })
  res.json(mypools);
    
}