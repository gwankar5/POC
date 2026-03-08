package com.example.treasurehunt.dto;

import java.time.Instant;

public record ScoreResponse(int rank, String playerName, int turnsTaken, Instant completedAt) {
}
