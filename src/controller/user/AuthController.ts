import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { User } from '../../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../../config/config';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const { username, password } = req.body;

        if(!(username && password)){
            return res.status(400).json({message: 'Username o Password incorrectos' });
        }

        const userRepository = getRepository(User);
        let user: User;
        try{
            user = await userRepository.findOneOrFail({ where: {username}})
        }catch(e){
            res.status(400).json({ message: 'Username o Password incorrectos' })
        }

        //comprobar password
        if(!user.checkPassword(password)){
            res.status(400).json({ message: 'Usuario o password incorrecto' })
        }

        //asigna token
        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, { expiresIn: '1h'})

        res.json({ messsage: 'OK', token});
    }
}

export default AuthController;