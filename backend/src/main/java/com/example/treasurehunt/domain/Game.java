package com.example.treasurehunt.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Game {
    private final String gameId;
    private final String playerId;
    private final int boardSize;
    private final Set<Position> treasurePositions;
    private final Map<Position, CellReveal> revealedCells;
    private int turnsTaken;
    private GameStatus status;
    private final Instant createdAt;
    private Instant updatedAt;

    public Game(String gameId, String playerId, int boardSize, Set<Position> treasurePositions, Instant createdAt) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.boardSize = boardSize;
        this.treasurePositions = Collections.unmodifiableSet(new LinkedHashSet<>(treasurePositions));
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
        this.revealedCells = new LinkedHashMap<>();
        this.turnsTaken = 0;
        this.status = GameStatus.IN_PROGRESS;
    }

    public String getGameId() {
        return gameId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public int getBoardSize() {
        return boardSize;
    }

    public Set<Position> getTreasurePositions() {
        return treasurePositions;
    }

    public Map<Position, CellReveal> getRevealedCells() {
        return Collections.unmodifiableMap(revealedCells);
    }

    public int getTurnsTaken() {
        return turnsTaken;
    }

    public GameStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public boolean isCompleted() {
        return status == GameStatus.COMPLETED;
    }

    public boolean isRevealed(Position position) {
        return revealedCells.containsKey(position);
    }

    public int getTreasureCount() {
        return treasurePositions.size();
    }

    public long treasuresFound() {
        return revealedCells.values().stream()
                .filter(CellReveal::treasure)
                .count();
    }

    public List<CellReveal> revealTurn(List<Position> positions) {
        ensureNotCompleted();
        ensurePositionsPresent(positions);
        ensureUniqueTurnPositions(positions);
        ensurePositionsNotAlreadyRevealed(positions);

        incrementTurn();

        List<CellReveal> reveals = new ArrayList<>(positions.size());
        for (Position position : positions) {
            boolean treasure = treasurePositions.contains(position);
            Integer proximity = treasure ? null : nearestTreasureProximity(position);

            CellReveal reveal = new CellReveal(position, treasure, proximity);
            revealedCells.put(position, reveal);
            reveals.add(reveal);
        }

        if (treasuresFound() == getTreasureCount()) {
            complete();
        } else {
            touch();
        }

        return List.copyOf(reveals);
    }

    private void ensureNotCompleted() {
        if (isCompleted()) {
            throw new IllegalStateException("The game is already completed.");
        }
    }

    private void ensurePositionsPresent(List<Position> positions) {
        if (positions == null || positions.isEmpty()) {
            throw new IllegalArgumentException("At least one position must be selected.");
        }
    }

    private void ensureUniqueTurnPositions(List<Position> positions) {
        if (new LinkedHashSet<>(positions).size() != positions.size()) {
            throw new IllegalArgumentException("Duplicate positions are not allowed in one turn.");
        }
    }

    private void ensurePositionsNotAlreadyRevealed(List<Position> positions) {
        for (Position position : positions) {
            if (isRevealed(position)) {
                throw new IllegalStateException("A revealed position cannot be selected again.");
            }
        }
    }

    /**
     * Requirement-aligned proximity model:
     * distance 1 => 3
     * distance 2 => 2
     * distance 3+ => 1
     */
    private int nearestTreasureProximity(Position position) {
        int minDistance = treasurePositions.stream()
                .mapToInt(treasurePosition -> chebyshevDistance(position, treasurePosition))
                .min()
                .orElseThrow();

        return Math.max(1, 4 - minDistance);
    }

    private int chebyshevDistance(Position first, Position second) {
        return Math.max(
                Math.abs(first.row() - second.row()),
                Math.abs(first.col() - second.col())
        );
    }

    private void incrementTurn() {
        this.turnsTaken++;
        touch();
    }

    public void complete() {
        this.status = GameStatus.COMPLETED;
        touch();
    }

    private void touch() {
        this.updatedAt = Instant.now();
    }
}
