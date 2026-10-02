import { asyncHandler } from '../utils/asyncHandler.js';

export const createUserController = (userService) => ({
  signup: asyncHandler(async (req, res) => {
    res.status(201).json(await userService.signup(req.body ?? {}));
  }),

  login: asyncHandler(async (req, res) => {
    res.json(await userService.login(req.body ?? {}));
  }),

  get: asyncHandler(async (req, res) => {
    res.json(await userService.getProfile(req.params.id));
  }),

  update: asyncHandler(async (req, res) => {
    res.json(await userService.updateProfile(req.params.id, req.body ?? {}));
  }),
});
