import express from "express";
import { Request, Response } from 'express'
import cors from 'cors'

import belvo from './routes/belvo';
import institutions from './routes/institutions';
import links from './routes/links';
import testDBRoute from './routes/testDb';

const server = express();
server.use(express.json())
server.use(cors())
 
server.use("/belvo", belvo);
server.use("/institutions", institutions);
server.use("/links", links);
server.use("/testDB", testDBRoute);

server.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server running",
    });
});

server.listen(3001);
