import express from "express";
import { Request, Response } from 'express'
import cors from 'cors'

const server = express();
server.use(express.json())
server.use(cors())

server.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Server running",
    });
});

export default server;