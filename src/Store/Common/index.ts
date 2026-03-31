import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CommonState = {
  isProfileCompleted: boolean;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  token: string | null;
  email: string | null;
  isEmailVerified: boolean;
  refreshToken: string | null;
  industry: string[];
  stage: string | null;
  profileType: string[];
  businessDescription: string | null;
  goal: string | null;
  phoneNumber: string | null;
  language: string;
};

const initialState: CommonState = {
  isProfileCompleted: false,
  userName: null,
  firstName: null,
  lastName: null,
  token: null,
  email: null,
  isEmailVerified: false,
  refreshToken: null,
  industry: [],
  stage: null,
  profileType: [],
  businessDescription: null,
  goal: null,
  phoneNumber: null,
  companyName: null,
  language: 'en',
};

const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        email?: string;
        userName?: string;
        isProfileCompleted?: boolean;
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.userName) state.userName = action.payload.userName;
      if (action.payload.isProfileCompleted !== undefined) {
        state.isProfileCompleted = action.payload.isProfileCompleted;
      }
    },
    setAuthData: (
      state,
      action: PayloadAction<{
        token?: string;
        refreshToken?: string;
        email?: string;
        userName?: string;
        isProfileCompleted?: boolean;
      }>
    ) => {
      Object.assign(state, action.payload);
    },
    setUserData: (
      state,
      action: PayloadAction<{
        firstName?: string;
        lastName?: string;
        companyName?: string;
        industry?: string[];
        stage?: string;
        profileType?: string[];
        businessDescription?: string;
        goal?: string;
        phoneNumber?: string;
      }>
    ) => {
      Object.assign(state, action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { login, setAuthData, setUserData, setLanguage, logout } =
  common.actions;

export default common.reducer;
