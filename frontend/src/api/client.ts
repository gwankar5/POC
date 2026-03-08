import type {
  CreatePlayerResponse,
  GameStateResponse,
  RevealResponse,
  ScoreResponse,
} from "../types";

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasBody = options.body !== undefined;

  const mergedHeaders: Record<string, string> = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...((options.headers as Record<string, string> | undefined) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unexpected error" }));
    throw new Error(error.message || "Unexpected error");
  }

  return response.json() as Promise<T>;
}

export const api = {
  createPlayer: (name: string) =>
    request<CreatePlayerResponse>("/players", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  getCurrentGame: (token: string) =>
    request<GameStateResponse>("/game/current", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  reveal: (token: string, positions: { row: number; col: number }[]) =>
    request<RevealResponse>("/game/reveal", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ positions }),
    }),

  getTopScores: () => request<ScoreResponse[]>("/scores/top10"),
};

export const apiClient = {
  createPlayer: (name: string) =>
    request<CreatePlayerResponse>("/players", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  getCurrentGame: (token: string) =>
    request<GameStateResponse>("/game/current", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  reveal: (token: string, positions: { row: number; col: number }[]) =>
    request<RevealResponse>("/game/reveal", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ positions }),
    }),

  getTopScores: () => request<ScoreResponse[]>("/scores/top10"),
};
