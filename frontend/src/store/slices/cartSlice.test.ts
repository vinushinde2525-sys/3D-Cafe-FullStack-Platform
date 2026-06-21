import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  selectCartCount,
  selectCartSubtotal,
  selectCartTotals,
} from './cartSlice';
import type { CartItem } from '@/types';

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  foodItem: 'food-1',
  name: 'Cappuccino',
  price: 150,
  image: '/cappuccino.jpg',
  quantity: 1,
  customizations: [],
  ...overrides,
});

describe('cartSlice reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns the initial empty cart state', () => {
    const state = cartReducer(undefined, { type: 'init' });
    expect(state.items).toEqual([]);
    expect(state.isOpen).toBe(false);
  });

  it('adds a new item to an empty cart', () => {
    const state = cartReducer(undefined, addItem(makeItem()));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].foodItem).toBe('food-1');
    expect(state.items[0].quantity).toBe(1);
  });

  it('increments quantity instead of duplicating when the same item + customizations is added again', () => {
    let state = cartReducer(undefined, addItem(makeItem({ quantity: 1 })));
    state = cartReducer(state, addItem(makeItem({ quantity: 2 })));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('treats the same foodItem with different customizations as a separate cart line', () => {
    let state = cartReducer(undefined, addItem(makeItem()));
    state = cartReducer(
      state,
      addItem(makeItem({ customizations: [{ name: 'Size', option: 'Large', extraPrice: 30 }] }))
    );
    expect(state.items).toHaveLength(2);
  });

  it('removes an item matching foodItem + customizations', () => {
    let state = cartReducer(undefined, addItem(makeItem()));
    state = cartReducer(state, removeItem({ foodItem: 'food-1', customizations: [] }));
    expect(state.items).toHaveLength(0);
  });

  it('updates quantity for an existing item', () => {
    let state = cartReducer(undefined, addItem(makeItem()));
    state = cartReducer(
      state,
      updateQuantity({ foodItem: 'food-1', customizations: [], quantity: 5 })
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes the item when quantity is updated to zero or below', () => {
    let state = cartReducer(undefined, addItem(makeItem()));
    state = cartReducer(
      state,
      updateQuantity({ foodItem: 'food-1', customizations: [], quantity: 0 })
    );
    expect(state.items).toHaveLength(0);
  });

  it('clears all items and any applied coupon', () => {
    let state = cartReducer(undefined, addItem(makeItem()));
    state = cartReducer(state, applyCoupon({ code: 'SAVE10', discount: 10 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toEqual([]);
    expect(state.couponCode).toBe('');
    expect(state.couponDiscount).toBe(0);
  });

  it('applies and removes a coupon', () => {
    let state = cartReducer(undefined, applyCoupon({ code: 'SAVE10', discount: 10 }));
    expect(state.couponCode).toBe('SAVE10');
    expect(state.couponDiscount).toBe(10);

    state = cartReducer(state, removeCoupon());
    expect(state.couponCode).toBe('');
    expect(state.couponDiscount).toBe(0);
  });

  it('persists cart items to localStorage on add', () => {
    cartReducer(undefined, addItem(makeItem()));
    const stored = JSON.parse(localStorage.getItem('cafe_cart') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].foodItem).toBe('food-1');
  });
});

describe('cart selectors', () => {
  const wrap = (items: CartItem[], couponDiscount = 0) => ({
    cart: { items, isOpen: false, couponCode: '', couponDiscount, isCouponLoading: false },
  });

  it('selectCartCount sums quantities across all line items', () => {
    const state = wrap([makeItem({ quantity: 2 }), makeItem({ foodItem: 'food-2', quantity: 3 })]);
    expect(selectCartCount(state)).toBe(5);
  });

  it('selectCartSubtotal sums price * quantity across all line items', () => {
    const state = wrap([
      makeItem({ price: 100, quantity: 2 }),
      makeItem({ foodItem: 'food-2', price: 50, quantity: 1 }),
    ]);
    expect(selectCartSubtotal(state)).toBe(250);
  });

  it('selectCartTotals adds delivery fee when subtotal is below the free-delivery threshold', () => {
    const state = wrap([makeItem({ price: 100, quantity: 1 })]); // subtotal = 100, below 500
    const totals = selectCartTotals(state);
    expect(totals.subtotal).toBe(100);
    expect(totals.deliveryFee).toBe(40);
    expect(totals.tax).toBeCloseTo(5); // 5% of 100
    expect(totals.total).toBeCloseTo(145);
  });

  it('selectCartTotals waives delivery fee at/above the free-delivery threshold', () => {
    const state = wrap([makeItem({ price: 500, quantity: 1 })]); // subtotal = 500
    const totals = selectCartTotals(state);
    expect(totals.deliveryFee).toBe(0);
  });

  it('selectCartTotals subtracts coupon discount and never goes negative', () => {
    const state = wrap([makeItem({ price: 100, quantity: 1 })], 1000); // huge discount
    const totals = selectCartTotals(state);
    expect(totals.total).toBe(0);
  });

  it('selectCartTotals charges no delivery fee on an empty cart', () => {
    const totals = selectCartTotals(wrap([]));
    expect(totals.subtotal).toBe(0);
    expect(totals.deliveryFee).toBe(0);
    expect(totals.total).toBe(0);
  });
});
