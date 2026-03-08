package com.example.treasurehunt.dto;

import com.example.treasurehunt.domain.GameStatus;

import java.util.List;

public record RevealResponse(
        int turnsTaken,
        GameStatus status,
        int treasuresFound,
        List<RevealCellResponse> reveals
) {
}
