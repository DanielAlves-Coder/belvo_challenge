import axios from 'axios'
import { Router, Request, Response } from 'express'
import {
  BELVO,
  MODE
} from '../../constants/index'

const router = Router()
const {
  SID,
  SP,
  BASE_URL
} = BELVO[MODE]

router.get("/list/:id?", (req: Request, res: Response) => {

  const url = `${BASE_URL}/api/institutions/${req.params.id ?? ""}?country_code=BR`
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
    })
} );

export default router;