import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  accentColor: string;
}

const initialState: ThemeState = {
  theme: 'light', // Always light for this premium brand
  accentColor: '#B89052',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('cafe_theme', action.payload);
      document.documentElement.classList.toggle('dark', action.payload === 'dark');
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
  },
});

export const { setTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;
