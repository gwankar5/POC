package com.example.treasurehunt.api;

import com.example.treasurehunt.dto.GameStateResponse;
import com.example.treasurehunt.dto.RevealRequest;
import com.example.treasurehunt.dto.RevealResponse;
import com.example.treasurehunt.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/game")
public class GameController {
    private static final String BEARER_PREFIX = "Bearer ";

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/current")
    public ResponseEntity<GameStateResponse> current(
            @RequestHeader(name = "Authorization", required = false) String authorization) {
        return ResponseEntity.ok(gameService.currentGame(extractToken(authorization)));
    }

    @PostMapping("/reveal")
    public ResponseEntity<RevealResponse> reveal(
            @RequestHeader(name = "Authorization", required = false) String authorization,
            @Valid @RequestBody RevealRequest request) {
        return ResponseEntity.ok(gameService.reveal(extractToken(authorization), request));
    }

    private String extractToken(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            return null;
        }

        String trimmedAuthorization = authorization.trim();
        if (trimmedAuthorization.startsWith(BEARER_PREFIX)) {
            return trimmedAuthorization.substring(BEARER_PREFIX.length()).trim();
        }
        return trimmedAuthorization;
    }
}
