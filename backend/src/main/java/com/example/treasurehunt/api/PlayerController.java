package com.example.treasurehunt.api;

import com.example.treasurehunt.dto.CreatePlayerRequest;
import com.example.treasurehunt.dto.CreatePlayerResponse;
import com.example.treasurehunt.service.GameService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/players")
public class PlayerController {
    private final GameService gameService;

    public PlayerController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<CreatePlayerResponse> create(@Valid @RequestBody CreatePlayerRequest request) {
        return ResponseEntity.ok(gameService.createPlayer(request));
    }
}
