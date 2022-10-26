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

router.get("/retrieve/:link_id?", (req: Request, res: Response) => {
  if(req.params.link_id === ""){
    res.status(500).send({ message: "Missing link_id" });
  }

  belvoClient.connect()
    .then(function () {
      belvoClient.accounts.retrieve(req.params.link_id ?? "")
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

router.get("/details/:account_id?", (req: Request, res: Response) => {
  if(req.params.link_id === ""){
    res.status(500).send({ message: "Missing account_id" });
  }

  belvoClient.connect()
    .then(function () {
      belvoClient.accounts.detail(req.params.account_id ?? "")
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

export default router;