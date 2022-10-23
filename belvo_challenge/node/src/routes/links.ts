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

router.post("/register", (req: Request, res: Response) => {
  console.log(req.body)
  const url = `${BASE_URL}/api/links/`
  axios.post(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(SID + ':' + SP).toString('base64')
    },
    data: req.body
    
  })
    .then((response) => {
      console.log("response:", response)
      res.status(response.status).json(response);
    })
    .catch(function (error) {
      console.log("error:", error)
      res.status(error.response.status).json(error);
    })
} );

export default router;