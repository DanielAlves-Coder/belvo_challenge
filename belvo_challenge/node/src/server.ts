import express from "express";
import { Request, Response } from 'express'
import cors from 'cors'

import accounts from './routes/accounts';
import auth from './routes/auth';
import institutions from './routes/institutions';
import links from './routes/links';
import testDBRoute from './routes/testDb';
import transactions from './routes/transactions';

const server = express();

server.use(express.json())
server.use(cors())
server.use(function (req, res, next) {
    console.log("Request received:", {
        origin: req.headers['origin'],
        route: req.originalUrl,
        at: new Date()
    })
    next()
})
 
server.use("/accounts", accounts);
server.use("/auth", auth);
server.use("/institutions", institutions);
server.use("/links", links);
server.use("/testDB", testDBRoute);
server.use("/transactions", transactions);

server.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server running",
    });
});

server.use(function (req, res, next) {
    console.log("Response send:", {
        origin: req.headers['origin'],
        route: req.originalUrl,
        at: new Date(),
        res: res
    })
    next()
})

server.listen(3001);
