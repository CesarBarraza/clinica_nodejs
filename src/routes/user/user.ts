import { Router } from 'express';
import { checkJwt } from '../../middlewares/jwt';
import { UserController } from '../../controller/user/UserController';
import { checkRole } from '../../middlewares/role';

const router = Router();

//Get all user
router.get('/', [checkJwt], UserController.getAll);

//Get one user
router.get('/:id', [checkJwt], UserController.getById);

//Create user
router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

//Edit user
router.patch('/:id', [checkJwt], UserController.editUser);

//Delete user

router.delete('/:id', [checkJwt], UserController.deleteUser);

export default router;