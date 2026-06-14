import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { CartItem, CartCustomization } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  isCouponLoading: boolean;
}

const loadCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('cafe_cart') || '[]'); } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cafe_cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCart(),
  isOpen: false,
  couponCode: '',
  couponDiscount: 0,
  isCouponLoading: false,
};

const TAX_RATE = 0.05;
const DELIVERY_FEE = 40;
const FREE_DELIVERY_THRESHOLD = 500;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { foodItem, customizations } = action.payload;
      const idx = state.items.findIndex(
        (i) => i.foodItem === foodItem && JSON.stringify(i.customizations) === JSON.stringify(customizations)
      );
      if (idx > -1) { state.items[idx].quantity += action.payload.quantity; }
      else { state.items.push(action.payload); }
      saveCart(state.items);
    },
    removeItem: (state, action: PayloadAction<{ foodItem: string; customizations: CartCustomization[] }>) => {
      state.items = state.items.filter(
        (i) => !(i.foodItem === action.payload.foodItem && JSON.stringify(i.customizations) === JSON.stringify(action.payload.customizations))
      );
      saveCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ foodItem: string; customizations: CartCustomization[]; quantity: number }>) => {
      const { foodItem, customizations, quantity } = action.payload;
      const idx = state.items.findIndex(
        (i) => i.foodItem === foodItem && JSON.stringify(i.customizations) === JSON.stringify(customizations)
      );
      if (idx > -1) {
        if (quantity <= 0) { state.items.splice(idx, 1); }
        else { state.items[idx].quantity = quantity; }
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = []; state.couponCode = ''; state.couponDiscount = 0;
      localStorage.removeItem('cafe_cart');
    },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => { state.couponCode = ''; state.couponDiscount = 0; },
    setCouponLoading: (state, action: PayloadAction<boolean>) => { state.isCouponLoading = action.payload; },
  },
});

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((s, i) => s + i.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
// FIX: Use createSelector so the returned object is memoized and doesn't
// trigger unnecessary re-renders when called with the same cart state.
export const selectCartTotals = createSelector(
  (state: { cart: CartState }) => state.cart.items,
  (state: { cart: CartState }) => state.cart.couponDiscount,
  (items, couponDiscount) => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * TAX_RATE;
    const deliveryFee = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const total = Math.max(0, subtotal + tax + deliveryFee - couponDiscount);
    return { subtotal, tax, deliveryFee, couponDiscount, total };
  }
);

export const { addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart, applyCoupon, removeCoupon, setCouponLoading } = cartSlice.actions;
export default cartSlice.reducer;
