package com.example.treasurehunt.dto;

import java.time.Instant;

public record ErrorResponse(String code, String message, Instant timestamp) {
}
