import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft: {
    firstName: '', lastName: '', email: '', mobileNo: '', password: '', confirmPassword: '', role: '', details: ''
  },
  users: JSON.parse(localStorage.getItem('registeredUsers')) || [],
  errors: {},
};

const formSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    updateDraft: (state, action) => {
      const { name, value } = action.payload;
      state.draft[name] = value;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    registerUser: (state) => {
      const emailExists = state.users.some(u => u.email === state.draft.email);
      const phoneExists = state.users.some(u => u.mobileNo === state.draft.mobileNo);
      if (emailExists || phoneExists) return;

      state.users.push({ ...state.draft, id: Date.now() });
      localStorage.setItem('registeredUsers', JSON.stringify(state.users));
      state.draft = { firstName: '', lastName: '', email: '', mobileNo: '', password: '', confirmPassword: '', details: '' };
      state.errors = {};
    },
    deleteSelected: (state, action) => {
      state.users = state.users.filter(user => !action.payload.includes(user.id));
      localStorage.setItem('registeredUsers', JSON.stringify(state.users));
    }
  },
});

export const { updateDraft, setErrors, registerUser, deleteSelected } = formSlice.actions;
export default formSlice.reducer;