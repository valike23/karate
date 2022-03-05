import type { Iathlete } from "../../model/application";
import { SqlHelper } from "../../model/mysql";
import { dbconfig } from "../../model/public";
const sqlHelper = new SqlHelper(dbconfig);
export function put(req, res){

    try {
        let data: Iathlete = JSON.parse(req.fields.athlete);
        let id = data.id;
        delete(data.id);
        delete(data.club);
        delete(data.category);
       let respond = sqlHelper.updateQuery('athlete',data,`where id=${id}`);
        res.json(respond);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}