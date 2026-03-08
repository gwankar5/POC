package com.example.treasurehunt.repo;

import com.example.treasurehunt.domain.Game;
import com.example.treasurehunt.domain.Player;
import com.example.treasurehunt.domain.ScoreEntry;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class InMemoryStore {
    private final Map<String, Player> playersByToken = new ConcurrentHashMap<>();
    private final Map<String, Game> gamesByPlayerId = new ConcurrentHashMap<>();
    private final List<ScoreEntry> scores = new CopyOnWriteArrayList<>();

    public Map<String, Player> playersByToken() { return playersByToken; }
    public Map<String, Game> gamesByPlayerId() { return gamesByPlayerId; }
    public List<ScoreEntry> scores() { return scores; }
}
