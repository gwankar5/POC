package com.example.treasurehunt.service;

import com.example.treasurehunt.domain.GameStatus;
import com.example.treasurehunt.dto.CreatePlayerRequest;
import com.example.treasurehunt.dto.PositionDto;
import com.example.treasurehunt.dto.RevealRequest;
import com.example.treasurehunt.exception.BusinessException;
import com.example.treasurehunt.repo.InMemoryStore;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    private GameService gameService;

    @BeforeEach
    void setUp() {
        gameService = new GameService(new InMemoryStore());
    }

    @Test
    void shouldCreatePlayerAndGame() {
        var response = gameService.createPlayer(new CreatePlayerRequest("Gaurav"));
        assertNotNull(response.playerId());
        assertEquals(GameStatus.IN_PROGRESS, response.status());
        assertEquals(5, response.boardSize());
    }

    @Test
    void shouldRejectDuplicateRevealPositions() {
        var create = gameService.createPlayer(new CreatePlayerRequest("Gaurav"));
        RevealRequest request = new RevealRequest(List.of(new PositionDto(0,0), new PositionDto(0,0)));
        BusinessException ex = assertThrows(BusinessException.class,
                () -> gameService.reveal(create.sessionToken(), request));
        assertEquals("INVALID_MOVE", ex.getCode());
    }
}
