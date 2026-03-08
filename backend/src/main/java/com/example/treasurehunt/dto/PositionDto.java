package com.example.treasurehunt.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record PositionDto(
        @Min(value = 0, message = "Row must be between 0 and 4.")
        @Max(value = 4, message = "Row must be between 0 and 4.")
        int row,
        @Min(value = 0, message = "Column must be between 0 and 4.")
        @Max(value = 4, message = "Column must be between 0 and 4.")
        int col
) {
}
