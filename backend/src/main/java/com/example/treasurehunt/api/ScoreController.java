package com.example.treasurehunt.api;

import com.example.treasurehunt.dto.ScoreResponse;
import com.example.treasurehunt.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/scores")
public class ScoreController {
    private final GameService gameService;

    public ScoreController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/top10")
    public ResponseEntity<List<ScoreResponse>> top10() {
        return ResponseEntity.ok(gameService.topScores());
    }
}
