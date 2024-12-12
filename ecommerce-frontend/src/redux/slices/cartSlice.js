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
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.addToCart(productId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al agregar al carrito' });
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartAPI.updateCartItem(itemId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al actualizar el carrito' });
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await cartAPI.removeFromCart(itemId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al eliminar del carrito' });
        }
    }
);

const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
        clearError: (state) => {
            state.error = null;
        }
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
                state.items = action.payload.items;
                state.total = action.payload.total;
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
                state.items = action.payload.items;
                state.total = action.payload.total;
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
                state.items = action.payload.items;
                state.total = action.payload.total;
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
                state.items = action.payload.items;
                state.total = action.payload.total;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al eliminar del carrito';
            });
    }
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
