import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ScoreResponse } from "../types";

/* ---------- Session Slice ---------- */

type SessionState = {
  sessionToken: string | null;
  playerName: string | null;
};

const initialSessionState: SessionState = {
  sessionToken: null,
  playerName: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState: initialSessionState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ sessionToken: string; playerName: string }>
    ) => {
      state.sessionToken = action.payload.sessionToken;
      state.playerName = action.payload.playerName;
    },
    resetGameState: (state) => {
      state.sessionToken = null;
      state.playerName = null;
    },
  },
});

/* ---------- Scores Slice ---------- */

type ScoresState = {
  items: ScoreResponse[];
};

const initialScoresState: ScoresState = {
  items: [],
};

const scoresSlice = createSlice({
  name: "scores",
  initialState: initialScoresState,
  reducers: {
    setScores: (state, action: PayloadAction<ScoreResponse[]>) => {
      state.items = action.payload;
    },
    clearScores: (state) => {
      state.items = [];
    },
  },
});

/* ---------- Exports ---------- */

export const { setSession, resetGameState } = sessionSlice.actions;
export const { setScores, clearScores } = scoresSlice.actions;

/* ---------- Store ---------- */

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    scores: scoresSlice.reducer,
  },
});

/* ---------- Types ---------- */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;