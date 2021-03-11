import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../../entity/User";
import { validate } from 'class-validator';

export class UserController {
    static getAll = async(req: Request, res: Response) =>{
        const userRepository = getRepository(User);
        const users= await userRepository.find();

        if(users.length >0 ){
            res.send(users);
        }else{
            res.status(404).json({ message: 'Sin resultados '})
        }
    }

    static getById = async(req: Request, res: Response) =>{
        const {id} = req.params;
        const userRepository = getRepository(User);

        try{
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        }catch(e){
            res.status(404).json({ message: 'Usuario no encontrado '})
        }
    }

    static newUser = async(req:Request, res: Response) =>{
        const { username, password, role } = req.body;
        const user = new User();

        user.username = username;
        user.password = password;
        user.role = role;

        //validar
        const errors = await validate(user, { validationError: { target: false, value: false }});
        if(errors.length > 0){
            return res.status(400).json({ message: errors});
        }

        const userRepository = getRepository(User);
        try{
            user.hashPassword()
            await userRepository.save(user);
        }catch(e){
            res.status(409).json({ massage: 'El usuario ya existe'})
        }

        res.send('usuario creado')
    }

    static editUser = async(req:Request, res: Response) =>{
        let user;
        const{id} = req.params;
        const {username, role} = req.body;

        const userRepository = getRepository(User);
        try{
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.role = role;
        }catch(e){
            res.status(404).json({ message: 'Usuario no encontrado'})
        }

        const errors = await validate(user, { validationError: { target: false, value: false }});
        if(errors.length > 0 ){
            res.status(400).json({ message: errors });
        }

        try{
            await userRepository.save(user);
        }catch(e){
            res.status(409).json({ message: 'El usuario ya existe'})
        }

        res.status(201).json({ message: 'Usuario editado' });
    }

    static deleteUser = async(req: Request, res: Response) =>{
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail(id);

        }catch(e){
            res.status(404).json({ message: 'Usuario no encontrado'})
        }

        userRepository.delete(id);
        res.status(201).json({ message: 'Usuario eliminado '});
    }
}

export default UserController;