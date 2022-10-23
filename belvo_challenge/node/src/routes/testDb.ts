import { Router, Request, Response } from 'express'
import mysql from 'mysql'
import {
  MODE,
  SQL
} from '@constants/index'

const {
  IP,
  SP,
  SID,
  DB
} = SQL[MODE]

const router = Router()
let connection: mysql.Connection = mysql.createConnection({
    host: IP,
    user: SID,
    password: SP,
    database: DB
  });

router.get("/", (req: Request, res: Response) => {
  connection.connect()
  connection.query('SELECT * FROM users',
    function (error: any, results: any, fields: any) {
      if (error) {
        res.status(500).json(error);
        throw error;
      }
      console.log('Query result: ', results);
      res.status(200).json(results);
    });
  connection.end();
} );

export default router;