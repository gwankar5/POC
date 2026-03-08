package com.example.treasurehunt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePlayerRequest(
        @NotBlank(message = "Player name is required.")
        @Size(max = 50, message = "Player name must not exceed 50 characters.")
        String name
) {
}
