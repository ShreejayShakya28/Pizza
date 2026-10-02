import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrderController = (orderService) => ({
  create: asyncHandler(async (req, res) => {
    const order = await orderService.placeOrder(req.body ?? {});
    res.status(201).json(order);
  }),

  // GET /api/orders?userId=1 -> that user's most recent orders
  list: asyncHandler(async (req, res) => {
    res.json(await orderService.listForUser(req.query.userId));
  }),
});
