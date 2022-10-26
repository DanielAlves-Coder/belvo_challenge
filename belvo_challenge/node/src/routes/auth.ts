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

router.get("/token", (req: Request, res: Response) => {
  belvoClient.connect()
  .then(function () {
        belvoClient.widgetToken.create()
      .then((response) => {
        res.json( response.access );
        })
      .catch((error) => {
      res.status(500).send({
        message: error.message
      });
    });
});
} );

export default router;