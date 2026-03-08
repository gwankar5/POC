import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cell from "../components/Cell";
import Toast from "../components/Toast";
import { api } from "../api/client";
import type {
  GameStateResponse,
  Position,
  RevealCellResponse,
  RevealResponse,
} from "../types";

const BOARD_SIZE = 5;
const MAX_SELECTION = 3;
const SESSION_KEY = "sessionToken";

function keyOf(position: Position): string {
  return `${position.row}:${position.col}`;
}

function mergeRevealedCells(
  existing: RevealCellResponse[],
  incoming: RevealCellResponse[]
): RevealCellResponse[] {
  const merged = new Map<string, RevealCellResponse>();

  for (const cell of existing) {
    merged.set(`${cell.row}:${cell.col}`, cell);
  }

  for (const cell of incoming) {
    merged.set(`${cell.row}:${cell.col}`, cell);
  }

  return Array.from(merged.values()).sort((a, b) =>
    a.row !== b.row ? a.row - b.row : a.col - b.col
  );
}

export default function GamePage() {
  const [game, setGame] = useState<GameStateResponse | null>(null);
  const [selectedCells, setSelectedCells] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMissToast, setShowMissToast] = useState(false);

  const token = localStorage.getItem(SESSION_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadGame() {
      if (!token) {
        setPageLoading(false);
        setError("No active session found. Start a new game.");
        return;
      }

      try {
        const currentGame = await api.getCurrentGame(token);
        if (mounted) {
          setGame(currentGame);
          setError(null);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load current game."
          );
        }
      } finally {
        if (mounted) {
          setPageLoading(false);
        }
      }
    }

    void loadGame();

    return () => {
      mounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!showMissToast) return;

    const timer = window.setTimeout(() => {
      setShowMissToast(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [showMissToast]);

  const revealedMap = useMemo(
    () =>
      new Map<string, RevealCellResponse>(
        (game?.revealedCells || []).map((cell) => [`${cell.row}:${cell.col}`, cell])
      ),
    [game]
  );

  const canReveal =
    selectedCells.length >= 1 &&
    selectedCells.length <= MAX_SELECTION &&
    !loading &&
    game?.status === "IN_PROGRESS";

  const handleCellClick = (position: Position) => {
    if (!game || loading || game.status === "COMPLETED") return;

    const positionKey = keyOf(position);

    if (revealedMap.has(positionKey)) {
      setError("This cell is already revealed.");
      return;
    }

    const isSelected = selectedCells.some(
      (cell) => cell.row === position.row && cell.col === position.col
    );

    setError(null);

    if (isSelected) {
      setSelectedCells((current) =>
        current.filter(
          (cell) => !(cell.row === position.row && cell.col === position.col)
        )
      );
      return;
    }

    if (selectedCells.length >= MAX_SELECTION) {
      setError("You can select up to 3 cells in one turn.");
      return;
    }

    setSelectedCells((current) => [...current, position]);
  };

  const handleReveal = async () => {
    if (!game || !token || !canReveal) return;

    try {
      setLoading(true);
      setError(null);

      const result: RevealResponse = await api.reveal(token, selectedCells);

      setGame({
        ...game,
        turnsTaken: result.turnsTaken,
        status: result.status,
        treasuresFound: result.treasuresFound,
        revealedCells: mergeRevealedCells(game.revealedCells, result.reveals),
      });

      setSelectedCells([]);

      if (!result.reveals.some((item) => item.treasure)) {
        setShowMissToast(true);
      }

      if (result.status === "COMPLETED") {
        navigate("/scores");
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Reveal failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="page-shell">
        <div className="show-card">
          <h2 className="show-title">Loading game...</h2>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="page-shell">
        <div className="show-card">
          <h2 className="show-title">Treasure Hunt</h2>
          <div className="error-banner">{error || "Game not available."}</div>
          <div className="action-row">
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate("/")}
            >
              Go to Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Toast
        open={showMissToast}
        title="Bazinga!"
        message="No treasure this turn. Recalibrate the clue trail and try again."
      />

      <div className="show-card">
        <h1 className="show-title">Treasure Hunt</h1>
        <p className="show-subtitle">
          Use the hottest clue numbers to track down the treasures. A reveal can
          check 1, 2, or 3 cells.
        </p>

        <div className="show-chip-row">
          <span className="show-chip">Player: {game.playerName}</span>
          <span className="show-chip">Turns: {game.turnsTaken}</span>
          <span className="show-chip">Treasures: {game.treasuresFound}/3</span>
        </div>

        <div className="legend-row">
          <span className="show-chip">
            <strong>💎</strong> treasure
          </span>
          <span className="show-chip">
            <strong>3</strong> closest clue
          </span>
          <span className="show-chip">
            <strong>2</strong> next ring
          </span>
          <span className="show-chip">
            <strong>1</strong> farthest visible ring
          </span>
        </div>

        <div className="board-wrapper">
          <div className="board-grid">
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
              const row = Math.floor(index / BOARD_SIZE);
              const col = index % BOARD_SIZE;
              const position = { row, col };
              const revealed = revealedMap.get(keyOf(position));
              const selected = selectedCells.some(
                (cell) => cell.row === row && cell.col === col
              );

              return (
                <Cell
                  key={`${row}:${col}`}
                  position={position}
                  revealed={revealed}
                  selected={selected}
                  disabled={loading}
                  onClick={handleCellClick}
                />
              );
            })}
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="action-row">
          <button
            className="primary-btn"
            type="button"
            disabled={!canReveal}
            onClick={handleReveal}
          >
            {loading ? "Revealing..." : `Reveal (${selectedCells.length})`}
          </button>

          <button
            className="secondary-btn"
            type="button"
            disabled={loading || selectedCells.length === 0}
            onClick={() => setSelectedCells([])}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}