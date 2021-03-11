import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import  config  from '../config/config';

export const checkJwt = async(req:Request, res:Response, next: NextFunction) =>{
    const token = <string>req.headers['auth'];
    let jwtPlayload;

    try{
        jwtPlayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPlayload = jwtPlayload;
    }catch(e){
        res.status(401).send();
    }

    const { userId, username } = jwtPlayload;

    const newToken = jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: '1h' });
    res.header('token', newToken);

    next();
}