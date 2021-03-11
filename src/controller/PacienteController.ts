import { getRepository } from 'typeorm';
import { Response, Request, json } from 'express';
import { Paciente } from '../entity/Paciente';
import { validate } from 'class-validator';
import { User } from '../entity/User';
import { userInfo } from 'os';
import { read } from 'fs';

class PacienteController{
    static getPacientes = async(req: Request, res: Response) => {
        const pacienteRepository = getRepository(Paciente);
        const pacientes = await pacienteRepository.find();

        try{
            res.send(pacientes);
        }catch(e){
            res.status(404).json({ message: 'Sin resultado' });
        }
    }

    static getById = async(req: Request, res: Response) =>{
        const { id } = req.params;
        const pacienteRepository = getRepository(Paciente);

        try{
            const paciente = await pacienteRepository.findOneOrFail(id);
            res.send(paciente);
        }catch(e){
            res.status(404).json({ message:'Paciente no encontrado'})
        }
    }

    static createPaciente = async(req: Request, res: Response) => {
        const { nombre, apellido, dni, direccion } = req.body;
        const paciente = new Paciente();

        paciente.nombre = nombre;
        paciente.apellido = apellido;
        paciente.dni = dni;
        paciente.direccion = direccion;

        //validar
        const errors = await validate(paciente, { validationError: { target: false, value: false }});
        if(errors.length > 0){
            return res.status(400).json({ message: errors});
        }

        const pacienteRepository = getRepository(Paciente);

        try{
            await pacienteRepository.save(paciente);
        }catch(e){
            res.status(409).json({ message: 'El paciente ya existe '});
        }

        res.send('Paciente creado')
    }

    static editPaciente = async(req: Request, res: Response) => {
        const { id } = req.params;
        const { nombre, apellido, direccion } = req.body;
        let paciente: Paciente;
        const pacienteRepository = getRepository(Paciente);

        try{
            paciente = await pacienteRepository.findOneOrFail(id);
            paciente.nombre = nombre;
            paciente.apellido = apellido;
            paciente.direccion = direccion;
        }catch(e){
            res.status(404).json({ message: 'Paciente no encontrado' });
        }

        try{
            await pacienteRepository.save(paciente);
        }catch(e){
            res.status(409).json({ message: 'El paciente ya existe' });
        }

        res.status(201).json({ message: 'Se modifico correctamente' });
    }

    static deletePaciente = async(req: Request, res: Response) => {
        const { id } = req.params;
        const pacienteRepository = getRepository(Paciente);
        let paciente: Paciente;

        try{
            paciente = await pacienteRepository.findOneOrFail(id);
        }catch(e){
            res.status(409).json({ message: 'Paciente no encontrado '})
        }

        pacienteRepository.delete(paciente);
        res.status(201).json({ message: 'Se eliminó correctamente '});
    }
}

export default PacienteController;