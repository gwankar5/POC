package com.example.treasurehunt.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RevealRequest(
        @NotEmpty(message = "At least one position must be selected.")
        @Size(max = 3, message = "You can reveal up to 3 positions in one turn.")
        List<@Valid PositionDto> positions
) {
}
