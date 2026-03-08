package com.example.treasurehunt.domain;

import java.time.Instant;

public record ScoreEntry(String playerName, int turnsTaken, Instant completedAt) {
}
