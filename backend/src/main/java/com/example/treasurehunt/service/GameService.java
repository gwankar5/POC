package com.example.treasurehunt.service;

import com.example.treasurehunt.domain.CellReveal;
import com.example.treasurehunt.domain.Game;
import com.example.treasurehunt.domain.Player;
import com.example.treasurehunt.domain.Position;
import com.example.treasurehunt.domain.ScoreEntry;
import com.example.treasurehunt.dto.CreatePlayerRequest;
import com.example.treasurehunt.dto.CreatePlayerResponse;
import com.example.treasurehunt.dto.GameStateResponse;
import com.example.treasurehunt.dto.PositionDto;
import com.example.treasurehunt.dto.RevealCellResponse;
import com.example.treasurehunt.dto.RevealRequest;
import com.example.treasurehunt.dto.RevealResponse;
import com.example.treasurehunt.dto.ScoreResponse;
import com.example.treasurehunt.exception.BusinessException;
import com.example.treasurehunt.repo.InMemoryStore;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {
    private static final int BOARD_SIZE = 5;
    private static final int TREASURE_COUNT = 3;

    private final InMemoryStore store;

    public GameService(InMemoryStore store) {
        this.store = store;
    }

    public CreatePlayerResponse createPlayer(CreatePlayerRequest request) {
        String playerId = UUID.randomUUID().toString();
        String token = UUID.randomUUID().toString();
        Instant now = Instant.now();

        Player player = new Player(playerId, request.name().trim(), token, now);
        Game game = new Game(UUID.randomUUID().toString(), playerId, BOARD_SIZE, generateTreasures(), now);

        store.playersByToken().put(token, player);
        store.gamesByPlayerId().put(playerId, game);

        return new CreatePlayerResponse(
                playerId,
                game.getGameId(),
                token,
                game.getStatus(),
                game.getBoardSize()
        );
    }

    public GameStateResponse currentGame(String token) {
        Player player = getPlayerByToken(token);
        Game game = getGameByPlayerId(player.playerId());
        return toGameState(player, game);
    }

    public RevealResponse reveal(String token, RevealRequest request) {
        Player player = getPlayerByToken(token);
        Game game = getGameByPlayerId(player.playerId());

        List<Position> positions = toPositions(request.positions());
        boolean completedBeforeReveal = game.isCompleted();

        List<CellReveal> reveals;
        try {
            reveals = game.revealTurn(positions);
        } catch (IllegalArgumentException exception) {
            throw new BusinessException("INVALID_MOVE", exception.getMessage());
        } catch (IllegalStateException exception) {
            String code = game.isCompleted() ? "GAME_COMPLETED" : "INVALID_MOVE";
            throw new BusinessException(code, exception.getMessage());
        }

        int treasuresFound = (int) game.treasuresFound();
        if (!completedBeforeReveal && game.isCompleted()) {
            store.scores().add(new ScoreEntry(player.name(), game.getTurnsTaken(), Instant.now()));
        }

        return new RevealResponse(
                game.getTurnsTaken(),
                game.getStatus(),
                treasuresFound,
                toRevealResponses(reveals)
        );
    }

    public List<ScoreResponse> topScores() {
        List<ScoreEntry> sorted = store.scores().stream()
                .sorted(Comparator.comparingInt(ScoreEntry::turnsTaken)
                        .thenComparing(ScoreEntry::completedAt))
                .limit(10)
                .toList();

        List<ScoreResponse> responses = new ArrayList<>(sorted.size());
        for (int index = 0; index < sorted.size(); index++) {
            ScoreEntry score = sorted.get(index);
            responses.add(new ScoreResponse(index + 1, score.playerName(), score.turnsTaken(), score.completedAt()));
        }
        return responses;
    }

    private List<Position> toPositions(List<PositionDto> positionDtos) {
        return positionDtos.stream()
                .map(positionDto -> new Position(positionDto.row(), positionDto.col()))
                .toList();
    }

    private List<RevealCellResponse> toRevealResponses(List<CellReveal> reveals) {
        return reveals.stream()
                .map(reveal -> new RevealCellResponse(
                        reveal.position().row(),
                        reveal.position().col(),
                        reveal.treasure(),
                        reveal.proximity()))
                .toList();
    }

    private Player getPlayerByToken(String token) {
        if (token == null || token.isBlank()) {
            throw new BusinessException("INVALID_SESSION", "Missing session token.");
        }

        Player player = store.playersByToken().get(token);
        if (player == null) {
            throw new BusinessException("INVALID_SESSION", "Session not found or expired.");
        }
        return player;
    }

    private Game getGameByPlayerId(String playerId) {
        Game game = store.gamesByPlayerId().get(playerId);
        if (game == null) {
            throw new BusinessException("INVALID_SESSION", "Game not found for the session.");
        }
        return game;
    }

    private GameStateResponse toGameState(Player player, Game game) {
        List<RevealCellResponse> revealed = game.getRevealedCells().values().stream()
                .map(cell -> new RevealCellResponse(
                        cell.position().row(),
                        cell.position().col(),
                        cell.treasure(),
                        cell.proximity()))
                .toList();

        return new GameStateResponse(
                player.name(),
                game.getBoardSize(),
                game.getTurnsTaken(),
                game.getStatus(),
                (int) game.treasuresFound(),
                revealed
        );
    }

    private Set<Position> generateTreasures() {
        Set<Position> treasures = new HashSet<>();
        ThreadLocalRandom random = ThreadLocalRandom.current();

        while (treasures.size() < TREASURE_COUNT) {
            treasures.add(new Position(random.nextInt(BOARD_SIZE), random.nextInt(BOARD_SIZE)));
        }

        return treasures;
    }
}
