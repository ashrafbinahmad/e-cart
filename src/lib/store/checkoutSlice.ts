import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  checkoutItems: {
    productId: string | number;
    quantity: string | number;
  }[]; // Replace 'any' with your cart data type
}

const initialState: CheckoutState = {
  checkoutItems: [],
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    set_checkout_products: (state, action: PayloadAction<any>) => {
      state.checkoutItems.push(action.payload);
    },
    remove_checkout_products: (state, action: PayloadAction<any>) => {
      const edittedCheckoutItemsList = state.checkoutItems.filter((checkoutItem) => {
        checkoutItem.productId != action.payload.productId;
      });
      state.checkoutItems = edittedCheckoutItemsList;
    },
    clear_checkout_products: (state) => {
      state.checkoutItems = [];
    },
  },
});

export const {
  set_checkout_products,
  remove_checkout_products,
  clear_checkout_products,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
