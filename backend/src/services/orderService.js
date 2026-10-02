import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';
import { parsePositiveInt } from '../utils/parse.js';

const MAX_QUANTITY_PER_ITEM = 20;
const MAX_DISTINCT_ITEMS = 20;
const RECENT_LIMIT = 10;

export class OrderService {
  constructor(orderRepository, menuRepository, userRepository) {
    this.orderRepository = orderRepository;
    this.menuRepository = menuRepository;
    this.userRepository = userRepository;
  }

  // placeOrder({ userId: 1, items: [{ itemId: 1, quantity: 2 }, { itemId: 2, quantity: 1 }], tipPercent: 15 })
  //   Margherita 1100 x 2 + Pepperoni 1300 x 1 = subtotal 3500
  //   tip 15% = 525, total = 4025
  async placeOrder({ userId, items, tipPercent = 0 } = {}) {
    const uid = parsePositiveInt(userId, 'userId');
    const lines = this.#normalizeLines(items);
    const tip = this.#normalizeTipPercent(tipPercent);

    if (!(await this.userRepository.findById(uid))) {
      throw new AppError('User not found', 404);
    }

    // Prices always come from the database, never from the client.
    const menuItems = await this.menuRepository.findByIds(lines.map((l) => l.itemId));
    const menuById = new Map(menuItems.map((m) => [m.id, m]));

    const priced = lines.map(({ itemId, quantity }) => {
      const menuItem = menuById.get(itemId);
      if (!menuItem) throw new AppError(`Menu item ${itemId} does not exist`, 404);
      return { itemId, name: menuItem.name, unitPriceCents: menuItem.price_cents, quantity };
    });

    const subtotalCents = priced.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
    // Rounded once, to whole cents. The frontend uses the exact same formula.
    const tipCents = Math.round((subtotalCents * tip) / 100);

    return this.orderRepository.create({
      userId: uid,
      items: priced,
      subtotalCents,
      tipCents,
      totalCents: subtotalCents + tipCents,
    });
  }

  listForUser(userId) {
    return this.orderRepository.findByUser(parsePositiveInt(userId, 'userId'), RECENT_LIMIT);
  }

  // Validates the cart and merges duplicates:
  // [{ itemId: 2, quantity: 1 }, { itemId: 2, quantity: 1 }] -> [{ itemId: 2, quantity: 2 }]
  #normalizeLines(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError('items must be a non-empty list', 400);
    }
    if (items.length > MAX_DISTINCT_ITEMS) {
      throw new AppError(`An order can hold at most ${MAX_DISTINCT_ITEMS} lines`, 400);
    }

    const merged = new Map();
    for (const raw of items) {
      const itemId = parsePositiveInt(raw?.itemId, 'itemId');
      const quantity = parsePositiveInt(raw?.quantity ?? 1, 'quantity');
      merged.set(itemId, (merged.get(itemId) ?? 0) + quantity);
    }

    return [...merged].map(([itemId, quantity]) => {
      if (quantity > MAX_QUANTITY_PER_ITEM) {
        throw new AppError(`quantity for item ${itemId} must be at most ${MAX_QUANTITY_PER_ITEM}`, 400);
      }
      return { itemId, quantity };
    });
  }

  // Only 0 ("no tip") or one of the offered options is accepted.
  #normalizeTipPercent(value) {
    const percent = Number(value);
    const allowed = [0, ...config.shop.tipOptions];
    if (!allowed.includes(percent)) {
      throw new AppError(`tipPercent must be one of: ${allowed.join(', ')}`, 400);
    }
    return percent;
  }
}
