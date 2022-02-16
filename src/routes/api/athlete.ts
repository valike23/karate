
import { readFile, utils } from 'xlsx';
import type { Iathlete, Icategory, Iclub, IexcelAthlete } from '../../model/application';
import {SqlHelper} from '../../model/mysql';
import { dbconfig } from '../../model/public';
const sqlHelper = new SqlHelper(dbconfig);
export async function post (req, res) {
    try {
        let data = await sqlHelper.insertQuery(JSON.parse(req.fields.athlete),'athlete');
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function get (req, res) {
    try {
        let data: any = await sqlHelper.innerjoin('athlete',[{name: 'category', foriegnKeyColumn:'category_id', primaryKeyColumn: 'id'},
        {name: 'club', foriegnKeyColumn:'state_id', primaryKeyColumn: 'id'}]);
        let athletes:Iathlete[] = [];
        data.forEach(element => {
            let athlete:Iathlete =  {};
            athlete.id = element.id;
            athlete.first_name = element.first_name;
            athlete.last_name = element.last_name;
            athlete.middle_name = element.middle_name;
            athlete.club = {};
            athlete.club.club_name = element.club_name;
            athlete.club.flag = element.flag;
            athlete.category = {};
            athlete.category.category_name = element.category_name;

            athletes.push(athlete);
        });
        res.json(athletes);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
  
}

export async function put(req, res) {
        try {
           let clubs: Iclub[] = await sqlHelper.get('club') as unknown as any as Iclub[];
           let categories: Icategory[] = await sqlHelper.get('category') as unknown as any as Icategory[];
            const workbook = readFile(req.files.excel.path);
        let athletes: Iathlete[] = [];
      let sheet:IexcelAthlete[] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      console.log(clubs);
      if(clubs){
          if(categories){
            sheet.forEach((e)=>{
                let athlete:Iathlete = {};
                athlete.first_name = e.firstName;
                athlete.last_name = e.lastName;
                athlete.middle_name = e.otherNames;
               try {
                athlete.state_id = clubs.find((club)=>{
                    return club.club_name == e.state
                 }).id;
                 athlete.category_id = categories.find((category)=>{
                     return category.category_name == e.category
                 }).id;
               } catch (error) {
                   
               }

                athletes.push(athlete);
              });
              let promises = [];
              athletes.forEach((e, i)=>{
               let promise = sqlHelper.insertQuery(e,'athlete');
               promises.push(promise);
              })
              Promise.all(promises).then((values)=>{
                console.log(values);
                res.json(values);
              })

         
          }
       
      }
     
        } catch (error) {
            console.log(error);
        res.status(503).json(error);
        }
}

export async function patch(req, res) {
    try {
        let name = req.query.name;
        let value = req.query.value; 
        let athletes:Iathlete[] = [];
       let data: any = await sqlHelper.innerjoin('athlete',[{primaryKeyColumn: 'id', foriegnKeyColumn: 'state_id',name:'club'}],
       ['athlete.id','athlete.first_name','athlete.last_name','athlete.middle_name','club.club_name', 'club.flag'],`where ${name} = ${value}`);
       data.forEach(element => {
           console.log(element.id);
        let athlete:Iathlete =  {};
        athlete.id = element.id;
        athlete.first_name = element.first_name;
        athlete.last_name = element.last_name;
        athlete.middle_name = element.middle_name;
        athlete.club = {};
        athlete.club.club_name = element.club_name;
        athlete.club.flag = element.flag;

        athletes.push(athlete);
    });
       res.json(athletes);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}

export async function del(req, res) {
    try {
      let data = await  sqlHelper.genericDelete('athlete', req.query.id);
      res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}