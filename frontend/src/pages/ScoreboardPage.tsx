import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setScores } from "../app/store";
import type { ScoreResponse } from "../types";

export default function ScoreboardPage() {
  const scores = useAppSelector((state): ScoreResponse[] => state.scores.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function loadScores(): Promise<void> {
      try {
        setLoading(true);
        setError("");

        const response: ScoreResponse[] = await api.getTopScores();

        if (!active) return;
        dispatch(setScores(response));
      } catch (e: unknown) {
        if (!active) return;

        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unable to load scores.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadScores();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="page-shell">
      <div className="show-card">
        <h1 className="show-title">Leaderboard</h1>
        <p className="show-subtitle">
          Fresh backend scores are loaded every time this page opens.
        </p>

        {loading && (
          <div className="show-chip-row">
            <span className="show-chip">Loading scores...</span>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        {!loading && !error && (
          <div className="score-table-wrap">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Turns</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score: ScoreResponse) => (
                  <tr
                    key={`${score.rank}-${score.playerName}-${score.completedAt}`}
                  >
                    <td>{score.rank}</td>
                    <td>{score.playerName}</td>
                    <td>{score.turnsTaken}</td>
                    <td>
                      {new Date(score.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="action-row">
          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate("/")}
          >
            Start Another Game
          </button>
        </div>
      </div>
    </div>
  );
}