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

function formatDate(date: Date) {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString()

  return `${year}-${month}-${day}`
}

router.post("/retrieve/:link_id?", (req: Request, res: Response) => {
  console.log(req.body)
  
  if((req.params.link_id ?? "") === ""){
    res.status(500).send({ message: "Missing link_id" });
  }
  if((req.body.dateFrom ?? "") === ""){
    res.status(500).send({ message: "Missing dateFrom in body" });
  }
  if((req.body.dateTo ?? "") === ""){
    res.status(500).send({ message: "Missing dateTo in body" });
  }
  
  let dateFrom: any = new Date(req.body.dateFrom ?? "")
  let dateTo: any = new Date(req.body.dateTo ?? "")

  if(isNaN(dateFrom)){
    res.status(500).send({ message: "Invalid dateFrom in body" });
  }
  if(isNaN(dateTo)){
    res.status(500).send({ message: "Invalid dateTo in body" });
  }

  if(dateFrom > dateTo){
    res.status(500).send({ message: "dateFrom cannot be greater than dateTo" });
  }

  if(dateTo > new Date()){
    res.status(500).send({ message: "dateTo cannot be greater than today" });
  }
  
  dateFrom = formatDate(dateFrom)
  dateTo = formatDate(dateTo)

  belvoClient.connect()
    .then(function () {
      belvoClient.transactions.retrieve(req.params.link_id ?? "", dateFrom, dateTo)
        .then((response) => {
          //console.log("transactions", response)
          res.json(response);
        })
        .catch((error) => {
          res.status(500).send({
          message: error.message
        });
      });
    });
});

export default router;