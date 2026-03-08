import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAppDispatch } from "../app/hooks";
import { resetGameState, setSession } from "../app/store";

const SESSION_KEY = "sessionToken";
const PLAYER_NAME_KEY = "playerName";

export default function StartGamePage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Player name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.createPlayer(trimmed);

      localStorage.setItem(SESSION_KEY, response.sessionToken);
      localStorage.setItem(PLAYER_NAME_KEY, trimmed);

      dispatch(resetGameState());
      dispatch(setSession({ sessionToken: response.sessionToken, playerName: trimmed }));
      navigate("/game");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start game.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="show-card">
        <h1 className="show-title">Treasure Hunt</h1>
        <p className="show-subtitle">
          Find all 3 treasures in the fewest turns.
          Bigger clue numbers mean you are closer.
        </p>

        <div className="show-chip-row">
          <span className="show-chip">💎 3 treasures</span>
          <span className="show-chip">Reveal 1–3 cells</span>
          <span className="show-chip">3 = hottest clue</span>
        </div>

        <form className="start-form" onSubmit={handleSubmit}>
          <input className="text-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter player name" maxLength={50} />
          <button className="primary-btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Starting..." : "Start Game"}
          </button>
        </form>

        {error ? <div className="error-banner">{error}</div> : null}
      </div>
    </div>
  );
}
