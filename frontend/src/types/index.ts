export type GameStatus = "IN_PROGRESS" | "COMPLETED";
export type Position = { row: number; col: number };
export type RevealCellResponse = { row: number; col: number; treasure: boolean; proximity: number | null };
export type CreatePlayerResponse = { playerId: string; gameId: string; sessionToken: string; status: GameStatus; boardSize: number };
export type GameStateResponse = { playerName: string; boardSize: number; turnsTaken: number; status: GameStatus; treasuresFound: number; revealedCells: RevealCellResponse[] };
export type RevealResponse = { turnsTaken: number; status: GameStatus; treasuresFound: number; reveals: RevealCellResponse[] };
export type ScoreResponse = { rank: number; playerName: string; turnsTaken: number; completedAt: string };
