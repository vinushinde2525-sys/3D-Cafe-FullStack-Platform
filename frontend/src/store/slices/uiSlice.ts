import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UiState {
  isPageLoading: boolean;
  activeModal: string | null;
  toasts: Toast[];
  searchQuery: string;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  scrollY: number;
  activeFlyingBean: { x: number; y: number; targetX: number; targetY: number } | null;
}

const initialState: UiState = {
  isPageLoading: false,
  activeModal: null,
  toasts: [],
  searchQuery: '',
  isSearchOpen: false,
  isMobileMenuOpen: false,
  scrollY: 0,
  activeFlyingBean: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => { state.isPageLoading = action.payload; },
    openModal: (state, action: PayloadAction<string>) => { state.activeModal = action.payload; },
    closeModal: (state) => { state.activeModal = null; },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({ ...action.payload, id: Date.now().toString() });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => { state.searchQuery = action.payload; },
    setSearchOpen: (state, action: PayloadAction<boolean>) => { state.isSearchOpen = action.payload; },
    toggleMobileMenu: (state) => { state.isMobileMenuOpen = !state.isMobileMenuOpen; },
    closeMobileMenu: (state) => { state.isMobileMenuOpen = false; },
    setScrollY: (state, action: PayloadAction<number>) => { state.scrollY = action.payload; },
    triggerFlyingBean: (state, action: PayloadAction<UiState['activeFlyingBean']>) => { state.activeFlyingBean = action.payload; },
    clearFlyingBean: (state) => { state.activeFlyingBean = null; },
  },
});

export const { setPageLoading, openModal, closeModal, addToast, removeToast, setSearchQuery, setSearchOpen, toggleMobileMenu, closeMobileMenu, setScrollY, triggerFlyingBean, clearFlyingBean } = uiSlice.actions;
export default uiSlice.reducer;
