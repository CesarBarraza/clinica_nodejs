import { Router } from 'express';
import PacienteController from '../../controller/PacienteController';
//import { checkJwt } from '../../middlewares/jwt';

const router = Router();

router.get('/', PacienteController.getPacientes);

router.get('/:id', PacienteController.getById);

router.post('/', PacienteController.createPaciente);

router.patch('/:id', PacienteController.editPaciente);

router.delete('/:id', PacienteController.deletePaciente);

export default router;