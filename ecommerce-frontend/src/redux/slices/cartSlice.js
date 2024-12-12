import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';

// Thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartAPI.getCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener el carrito' });
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addItem',
    async ({ productId, quantity, price }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.addToCart(productId, quantity, price);
            // Después de agregar, obtener el carrito actualizado
            const cartResponse = await cartAPI.getCart();
            return cartResponse.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al agregar al carrito' });
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateItem',
    async ({ orderId, itemId, quantity, price }, { rejectWithValue }) => {
        try {
            await cartAPI.updateCartItem(orderId, itemId, quantity, price);
            // Después de actualizar, obtener el carrito actualizado
            const response = await cartAPI.getCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al actualizar el carrito' });
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeItem',
    async (orderId, { rejectWithValue }) => {
        try {
            await cartAPI.removeFromCart(orderId);
            // Después de eliminar, obtener el carrito actualizado
            const response = await cartAPI.getCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al eliminar del carrito' });
        }
    }
);

export const checkoutCart = createAsyncThunk(
    'cart/checkout',
    async ({ orderId, shippingAddress, paymentMethod }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.checkout(orderId, shippingAddress, paymentMethod);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al procesar el checkout' });
        }
    }
);

const initialState = {
    items: [], // Array de órdenes con status 'cart'
    total: 0,
    loading: false,
    error: null,
    checkoutSuccess: false
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.checkoutSuccess = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetCheckoutStatus: (state) => {
            state.checkoutSuccess = false;
        },
        updateCartQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item._id === productId);
            if (item) {
                item.quantity = quantity;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.total = action.payload.reduce((sum, order) => sum + order.totalAmount, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al obtener el carrito';
            })
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.total = action.payload.reduce((sum, order) => sum + order.totalAmount, 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al agregar al carrito';
            })
            // Update Cart Item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.total = action.payload.reduce((sum, order) => sum + order.totalAmount, 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al actualizar el carrito';
            })
            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.total = action.payload.reduce((sum, order) => sum + order.totalAmount, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al eliminar del carrito';
            })
            // Checkout
            .addCase(checkoutCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.checkoutSuccess = false;
            })
            .addCase(checkoutCart.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutSuccess = true;
                // Remover la orden que se convirtió en compra del carrito
                state.items = state.items.filter(item => item._id !== action.payload._id);
                state.total = state.items.reduce((sum, order) => sum + order.totalAmount, 0);
            })
            .addCase(checkoutCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al procesar el checkout';
                state.checkoutSuccess = false;
            });
    }
});

export const { clearCart, clearError, resetCheckoutStatus, updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
