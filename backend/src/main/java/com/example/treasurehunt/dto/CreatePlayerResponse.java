package com.example.treasurehunt.dto;

import com.example.treasurehunt.domain.GameStatus;

public record CreatePlayerResponse(
        String playerId,
        String gameId,
        String sessionToken,
        GameStatus status,
        int boardSize
) {
}
