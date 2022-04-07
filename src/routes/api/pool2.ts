import { SqlHelper } from "../../model/mysql";
import { dbconfig } from "../../model/public";

const sql = new SqlHelper(dbconfig);
export async function put (req, res) {
    try {
        let {id} = req.query;
        let data = await sql.updateQuery('pool',
        {active_time: new Date().toISOString().slice(0, 19).replace('T', ' ')},
         ` where id = ${id}`);
         res.json(data);

    } catch (error) {
        res.status(503).send(JSON.stringify(error));
    }

}