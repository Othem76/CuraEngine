import UserController from "#controllers/user/userController";
import router from "@adonisjs/core/services/router";

router.get('getAllUsers', [UserController, 'getAll'])
router.get('getUserById/:id', [UserController, 'getUserById'])
router.get('getUserByEmail', [UserController, 'getUserByEmail'])
router.post('createUser', [UserController, 'create'])
router.patch('updateUser', [UserController, 'update'])
router.delete('deleteUser/:id', [UserController, 'delete'])
