import { useAppDispatch, useAppSelector } from '@/store';
import { resolveItemImage } from '@/utils/foodImage';
import {
  addItem, removeItem, updateQuantity, clearCart,
  toggleCart, openCart, closeCart,
  applyCoupon, removeCoupon,
  selectCartItems, selectCartOpen, selectCartCount,
  selectCartSubtotal, selectCartTotals,
} from '@/store/slices/cartSlice';
import { triggerFlyingBean } from '@/store/slices/uiSlice';
import type { CartItem, CartCustomization, FoodItem } from '@/types';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectCartOpen);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const totals = useAppSelector(selectCartTotals);
  const couponCode = useAppSelector((s) => s.cart.couponCode);

  const addToCart = (
    food: FoodItem,
    quantity = 1,
    customizations: CartCustomization[] = [],
    fromRect?: DOMRect
  ) => {
    const item: CartItem = {
      foodItem: food._id,
      name: food.name,
      price: food.discountPrice ?? food.price,
      image: resolveItemImage(food.images?.[0]?.url, food.name, food.category),
      quantity,
      customizations,
    };
    dispatch(addItem(item));

    // Flying bean animation
    if (fromRect) {
      const cartBtn = document.querySelector('[data-cart-button]');
      if (cartBtn) {
        const targetRect = cartBtn.getBoundingClientRect();
        dispatch(triggerFlyingBean({
          x: fromRect.left + fromRect.width / 2,
          y: fromRect.top + fromRect.height / 2,
          targetX: targetRect.left + targetRect.width / 2,
          targetY: targetRect.top + targetRect.height / 2,
        }));
      }
    }
  };

  const removeFromCart = (foodItem: string, customizations: CartCustomization[] = []) => {
    dispatch(removeItem({ foodItem, customizations }));
  };

  const changeQuantity = (foodItem: string, customizations: CartCustomization[], quantity: number) => {
    dispatch(updateQuantity({ foodItem, customizations, quantity }));
  };

  const isInCart = (foodItemId: string) => items.some((i) => i.foodItem === foodItemId);

  const getItemQuantity = (foodItemId: string) =>
    items.find((i) => i.foodItem === foodItemId)?.quantity ?? 0;

  return {
    items, isOpen, count, subtotal, totals, couponCode,
    addToCart, removeFromCart, changeQuantity, isInCart, getItemQuantity,
    clearCart: () => dispatch(clearCart()),
    toggleCart: () => dispatch(toggleCart()),
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    applyCoupon: (code: string, discount: number) => dispatch(applyCoupon({ code, discount })),
    removeCoupon: () => dispatch(removeCoupon()),
  };
};
