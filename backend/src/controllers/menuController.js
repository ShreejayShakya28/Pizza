import { asyncHandler } from '../utils/asyncHandler.js';

export const createMenuController = (menuService) => ({
  getMenu: asyncHandler(async (_req, res) => {
    res.json(await menuService.getPageContent());
  }),
});
