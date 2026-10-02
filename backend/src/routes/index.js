import { Router } from 'express';
import { pool } from '../config/db.js';
import { menuRepository } from '../repositories/menuRepository.js';
import { orderRepository } from '../repositories/orderRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { MenuService } from '../services/menuService.js';
import { OrderService } from '../services/orderService.js';
import { UserService } from '../services/userService.js';
import { createMenuController } from '../controllers/menuController.js';
import { createOrderController } from '../controllers/orderController.js';
import { createUserController } from '../controllers/userController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Wire dependencies once, here.
const menu = createMenuController(new MenuService(menuRepository));
const users = createUserController(new UserService(userRepository));
const orders = createOrderController(
  new OrderService(orderRepository, menuRepository, userRepository)
);

const router = Router();

router.get('/health', asyncHandler(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
}));

router.get('/menu', menu.getMenu);

router.post('/users/signup', users.signup);
router.post('/users/login', users.login);
router.get('/users/:id', users.get);
router.patch('/users/:id', users.update);

router.get('/orders', orders.list);
router.post('/orders', orders.create);

export default router;
