import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cartItems: {
    id: string | number;
    productId: string | number;
    quantity: string | number;
  }[]; // Replace 'any' with your cart data type
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialize_cart: (state, action: PayloadAction<any>) => {
      state.cartItems = action.payload;
    },
    add_to_cart: (state, action: PayloadAction<any>) => {
      state.cartItems.push(action.payload);
    },
    remove_from_cart: (state, action: PayloadAction<any>) => {
      const edittedCartItemsList = state.cartItems.filter((cartItem) => {
        cartItem.id != action.payload.id;
      });
      state.cartItems = edittedCartItemsList;
    },
    clear_cart: (state) => {
      state.cartItems = [];
    },
  },
});

export const {initialize_cart, add_to_cart, remove_from_cart, clear_cart } = cartSlice.actions;
export default cartSlice.reducer;
