package com.example.treasurehunt.dto;

public record RevealCellResponse(int row, int col, boolean treasure, Integer proximity) {
}
