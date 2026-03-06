package com.tradevault.controller;

import com.tradevault.model.User;
import com.tradevault.service.TradingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaderboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaderboardController {

    @Autowired
    private TradingService tradingService;

    @GetMapping
    public ResponseEntity<?> getLeaderboard() {
        try {
            // This is a simplified version. In a real application, you'd want to
            // create a proper query with joins and ordering at the database level
            List<Map<String, Object>> leaderboard = new ArrayList<>();
            
            // For demo purposes, we'll return mock data
            // In production, you'd query all users and calculate their total assets
            Map<String, Object> user1 = new HashMap<>();
            user1.put("username", "trader1");
            user1.put("totalAssets", new BigDecimal("12500.00"));
            user1.put("totalProfit", new BigDecimal("2500.00"));
            user1.put("rank", 1);
            leaderboard.add(user1);
            
            Map<String, Object> user2 = new HashMap<>();
            user2.put("username", "investor2");
            user2.put("totalAssets", new BigDecimal("11800.00"));
            user2.put("totalProfit", new BigDecimal("1800.00"));
            user2.put("rank", 2);
            leaderboard.add(user2);
            
            Map<String, Object> user3 = new HashMap<>();
            user3.put("username", "stockguru");
            user3.put("totalAssets", new BigDecimal("11200.00"));
            user3.put("totalProfit", new BigDecimal("1200.00"));
            user3.put("rank", 3);
            leaderboard.add(user3);
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
