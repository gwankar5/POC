import type { Position, RevealCellResponse } from "../types";

type CellProps = {
  position: Position;
  revealed?: RevealCellResponse;
  selected: boolean;
  disabled?: boolean;
  onClick: (position: Position) => void;
};

function getClassName(revealed?: RevealCellResponse, selected?: boolean): string {
  if (revealed?.treasure) return "cell-btn cell-treasure";
  if (revealed?.proximity === 3) return "cell-btn cell-proximity-3";
  if (revealed?.proximity === 2) return "cell-btn cell-proximity-2";
  if (revealed?.proximity === 1) return "cell-btn cell-proximity-1";
  if (selected) return "cell-btn cell-selected";
  return "cell-btn cell-hidden";
}

export default function Cell({
  position,
  revealed,
  selected,
  disabled = false,
  onClick,
}: CellProps) {
  const label = revealed
    ? revealed.treasure
      ? "💎"
      : String(revealed.proximity ?? "")
    : selected
      ? "✓"
      : "";

  return (
    <button
      type="button"
      disabled={disabled || !!revealed}
      onClick={() => onClick(position)}
      className={getClassName(revealed, selected)}
      aria-label={`cell-${position.row}-${position.col}`}
    >
      {label}
    </button>
  );
}