import { Router } from 'express';

import auth from './user/auth';
import user from './user/user';
import paciente from './paciente/paciente';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/pacientes', paciente)

export default router;