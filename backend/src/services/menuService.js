import { config } from '../config/index.js';

export class MenuService {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  // Everything the page needs in one payload.
  async getPageContent() {
    const items = await this.menuRepository.findAll();
    return { shop: config.shop, items };
  }
}
