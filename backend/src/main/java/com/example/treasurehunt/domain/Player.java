package com.example.treasurehunt.domain;

import java.time.Instant;

public record Player(String playerId, String name, String sessionToken, Instant createdAt) {
}
