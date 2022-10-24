import axios from 'axios'
import belvo from 'belvo'
import mysql from 'mysql2'
import { Router, Request, Response } from 'express'
import {
  BELVO,
  MODE,
  SQL
} from '@constants/index'

const router = Router()
const {
  SID: BELVO_SID,
  SP: BELVO_SP,
} = BELVO[MODE]

const {
  IP: SQL_IP,
  SP: SQL_SP,
  SID: SQL_SID,
  DB: SQL_DB
} = SQL[MODE]


const belvoClient: belvo = new belvo(
  BELVO_SID,
  BELVO_SP,
  MODE
);

const dbConnection: mysql.Connection = mysql.createConnection({
  host: SQL_IP,
  user: SQL_SID,
  password: SQL_SP,
  database: SQL_DB
})
dbConnection.connect()

router.post("/store", (req: Request, res: Response) => {
  console.log(req.body)
  //dbConnection.connect()
  dbConnection.query('INSERT INTO links (user_id, external_link_id, institution) VALUES (1, ?, ?)',[req.body.link, req.body.institution],
    function (error: any) {
      if (error) {
        res.status(500).json(error);
        throw error;
      }
      res.status(200);
    });
  //dbConnection.end();
});

router.get("/getall", async (req: Request, res: Response) => {
  const sqlQuery = 'SELECT external_link_id FROM links WHERE user_id = ? LIMIT 15'
  
  let allLinks: any[]= []
  const queryResults: any = await new Promise((promRes, promRej) => {
     dbConnection.query(sqlQuery, [1],
      function (error: any, results: any,) {
        if (error) {
          res.status(500).json(error);
          throw error;
        }
        return promRes(results)
       })
  })
  
  for (const row of queryResults) {
    allLinks.push(await getLinkDetails(row.external_link_id))
  }
  res.status(200).json(allLinks);

});

async function getLinkDetails(linkId: string) {
  try {
      await belvoClient.connect()
      return await belvoClient.links.detail(linkId)
  } catch (error) {
      console.error(error);
  }
}

router.get("/details/:id", (req: Request, res: Response) => {
  console.log(req.body)

  if(req.params.id === ""){
    res.status(500).send({ message: "Missing link id" });
  }

  belvoClient.connect()
  .then(function () {
    belvoClient.links.detail(req.params.id ?? "")
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message
        });
      });
  });
});

router.delete("/remove/:id", (req: Request, res: Response) => {
  console.log(req.body)

  if(req.params.id === ""){
    res.status(500).send({ message: "Missing link id" });
  }

  belvoClient.connect()
  .then(function () {
    belvoClient.links.delete(req.params.id ?? "")
      .then((response) => {
        const sqlQuery = 'DELETE FROM links WHERE user_id = ? AND external_link_id = ?'
        dbConnection.query(sqlQuery,[1, req.params.id]);
        res.json(response);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message
        });
      });
  });
});

/*router.post("/register", (req: Request, res: Response) => {
  console.log(req.body)
  const url = `${BASE_URL}/api/links/`
  axios.post(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(BELVO_SID + ':' + BELVO_SP).toString('base64')
    },
    data: req.body
    
  })
    .then((response) => {
      console.log("link registered:", response)
      res.status(response.status).json(response);
    })
    .catch(function (error) {
      console.log("link error:", error)
      res.status(error.response.status).json(error);
    })
});*/

export default router;