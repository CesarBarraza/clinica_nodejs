import { getRepository } from 'typeorm';
import { Response, Request, json } from 'express';
import { Paciente } from '../entity/Paciente';
import { validate } from 'class-validator';

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
        const { nombre, apellido, dni, fechaDeNacimiento, direccion, localidad, telefono } = req.body;
        const paciente = new Paciente();
        
        const fecha = new Date(fechaDeNacimiento)
        const dia = fecha.getDay();
        const mes = fecha.getMonth();
        const anio = fecha.getFullYear()

        paciente.nombre = nombre;
        paciente.apellido = apellido;
        paciente.dni = dni;
        paciente.fechaDeNacimiento = `${dia}/${mes}/${anio}`;

        paciente.direccion = direccion;
        paciente.localidad = localidad;
        paciente.telefono = telefono;

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
        const { nombre, apellido, dni, fechaDeNacimiento, direccion, localidad, telefono } = req.body;
        let paciente: Paciente;
        const pacienteRepository = getRepository(Paciente);

        try{
            paciente = await pacienteRepository.findOneOrFail(id);
            paciente.nombre = nombre;
            paciente.apellido = apellido;
            paciente.dni = dni;
            paciente.fechaDeNacimiento = fechaDeNacimiento;
            paciente.direccion = direccion;
            paciente.localidad = localidad;
            paciente.telefono = telefono;
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
        res.status(201).json({ message: 'Se elimin?? correctamente '});
    }
}

export default PacienteController;