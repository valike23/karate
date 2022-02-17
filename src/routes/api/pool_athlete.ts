import type { Iathlete, IpoolAthlete } from '../../model/application';
import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let pools: IpoolAthlete[] = JSON.parse(req.fields.pool);
        console.log(pools);
        let promises = [];
        pools.forEach((pool)=>{
          promises.push(sqlHelper.insertQuery(pool,'pool_athlete'));  
        })
       Promise.all(promises).then((values)=>{
           console.log(values);
        res.json(values);
       })
        
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}

export async function get (req, res) {
    try {
        let data: any = await sqlHelper.innerjoin('pool_athlete',[{name: 'athlete', foriegnKeyColumn:'athlete_id', primaryKeyColumn: 'id'}],[],
        `where pool_id =${req.query.id}`);
        let pool_athlete:IpoolAthlete = {};
        pool_athlete.athletes = [];
        data.forEach(element => {
            
            let athlete: Iathlete = {};
            athlete.id = element.id;
            athlete.active_time = element.active_time;
            athlete.first_name = element.first_name;
            athlete.last_name = element.last_name;
            athlete.middle_name = element.middle_name;
            athlete.result = element.result;

            pool_athlete.athletes.push(athlete);
        });
        res.json(pool_athlete);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}

export async function put (req, res) {
    try {

        let pool = req.query.pool;
        let athlete = req.query.athlete;
            if(req.query.status == 'start'){
                let data = await sqlHelper.updateQuery('pool_athlete',{active_time: new Date().toISOString().slice(0, 19).replace('T', ' ')}, `where pool_id=${pool} and athlete_id=${athlete}`);
                res.json(data);
            }
            else if(req.query.status == 'end') {
                let data = await sqlHelper.updateQuery('pool_athlete',{end_time: new Date().toISOString().slice(0, 19).replace('T', ' ')}, `where pool_id=${pool} and athlete_id=${athlete}`);
                res.json(data);
            }
            else if(req.query.status == 'result'){
                let result = req.query.result;
                let data = await sqlHelper.updateQuery('pool_athlete',result, `where pool_id=${pool} and athlete_id=${athlete}`);
                res.json(data);
            }
            else{
                let pool = req.query.pool;
            let athlete = req.query.athlete;
            let kata = req.query.kata;
            let data = await sqlHelper.updateQuery('pool_athlete',{kata}, `where pool_id=${pool} and athlete_id=${athlete}`);
        res.json(data);
            }
        
       
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}
