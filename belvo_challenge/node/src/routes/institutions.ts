//import axios from 'axios'
import belvo from 'belvo'
import { Router, Request, Response } from 'express'
import {
  BELVO,
  MODE
} from '@constants/index'

const router = Router()
const {
  SID,
  SP,
} = BELVO[MODE]

const belvoClient = new belvo(
  SID,
  SP,
  MODE
);

router.get("/list/:id?", (req: Request, res: Response) => {

  belvoClient.connect()
  .then(function () {
    belvoClient.institutions.list(/*{
      filters: {
        country_code: "BR"
      }
    }*/)
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message
        });
      });
  });
  /*const url = `${BASE_URL}/api/institutions/${req.params.id ?? ""}?country_code=BR`
  axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Basic ' + Buffer.from(SID + ':' + SP).toString('base64')
    },
  })
    .then((response) => {
      //console.log("response:", response)
      res.status(response.status).json(response.data);
    })
    .catch(function (error) {
      //console.log("error:", error)
      res.status(error.response.status).json(error);
    })*/
} );

export default router;