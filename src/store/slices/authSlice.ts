import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getUserFromToken, type User } from '../../utils/authUtils';

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
}

// Initial state: try to read from localStorage
const storedToken = localStorage.getItem('token');
const initialUser = getUserFromToken(storedToken);

const initialState: AuthState = {
    token: storedToken,
    user: initialUser,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            const { token } = action.payload;
            state.token = token;
            state.user = getUserFromToken(token);
            state.isAuthenticated = true;

            // Sync with localStorage
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            // Sync with localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userProfileOverrides'); // Clean up other auth related items if any
        },
        updateUserImage: (state, _action: PayloadAction<string>) => {
            if (state.user) {
                // Note: This updates the local state, but usually the image URL implies a profile re-fetch might be needed 
                // or we just store the override. For now, let's just allow updating it if we store it in the user object.
                // But wait, the User object from token might not have the image URL if it's not in the token.
                // The existing code used `localStorage.getItem('userProfileOverrides')` for this.
                // We can keep that pattern or add it to Redux state separately.
                // For now, let's stick to the core task: JWT.
                // We'll leave this out unless requested, or if we want to move profile overrides to Redux too.
                // Given the task is about JWT, I'll stick to that, but I'll add a way to update the user object if needed.
            }
        }
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
