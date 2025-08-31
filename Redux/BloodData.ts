import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BloodDonor {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  };
  phone: string;
  dateOfBirth: string;
  bloodGroup: "O+" | "O-" | "AB+" | "AB-" | "A+" | "A-" | "B+" | "B-";
  address: { place: string; pincode: number };
  lastDonationDate?: string | null;
  profileImage?: string;
}

type State = BloodDonor[];
const initialState: State = [];

const normalize = (d: any): BloodDonor => ({
  ...d,
  id: d.id ?? d._id ?? String(d.userId?.id ?? d.userId?._id ?? Math.random()),
});

const dedupeById = (arr: BloodDonor[]) => {
  const map = new Map<string, BloodDonor>();
  for (const d of arr) map.set(d.id, d);
  return Array.from(map.values());
};

const bloodSlice = createSlice({
  name: "bloodData",
  initialState,
  reducers: {
    // Merge fresh API list with current state so optimistic item doesn't vanish
    setBloods: (state, action: PayloadAction<any[]>) => {
      const incoming = (action.payload ?? []).map(normalize);
      const merged = dedupeById([...incoming, ...state]);
      return merged;
    },
    // Optimistic add/update a single donor
    addBlood: (state, action: PayloadAction<any>) => {
      const donor = normalize(action.payload);
      const idx = state.findIndex((d) => d.id === donor.id);
      if (idx === -1) state.unshift(donor);
      else state[idx] = donor;
    },
    clearBloods: () => initialState,
  },
});

export const { setBloods, addBlood, clearBloods } = bloodSlice.actions;
export default bloodSlice.reducer;
