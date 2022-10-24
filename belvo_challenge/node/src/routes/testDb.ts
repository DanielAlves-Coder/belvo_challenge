import { Router, Request, Response } from 'express'
import mysql from 'mysql2'
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
let dbConnection: mysql.Connection = mysql.createConnection({
    host: IP,
    user: SID,
    password: SP,
    database: DB
  });

router.get("/", (req: Request, res: Response) => {
  dbConnection.connect()
  dbConnection.query('SELECT * FROM users',
    function (error: any, results: any, fields: any) {
      if (error) {
        res.status(500).json(error);
        throw error;
      }
      console.log('Query result: ', results);
      res.status(200).json(results);
    });
  dbConnection.end();
} );

export default router;