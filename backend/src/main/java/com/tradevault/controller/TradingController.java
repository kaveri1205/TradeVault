package com.tradevault.controller;

import com.tradevault.dto.TradeRequest;
import com.tradevault.model.Portfolio;
import com.tradevault.model.Transaction;
import com.tradevault.model.User;
import com.tradevault.service.AuthService;
import com.tradevault.service.TradingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/trading")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TradingController {

    @Autowired
    private TradingService tradingService;

    @Autowired
    private AuthService authService;

    @PostMapping("/buy")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> buyStock(@Valid @RequestBody TradeRequest tradeRequest) {
        try {
            User currentUser = authService.getCurrentUser();
            Transaction transaction = tradingService.buyStock(currentUser.getId(), tradeRequest);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/sell")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sellStock(@Valid @RequestBody TradeRequest tradeRequest) {
        try {
            User currentUser = authService.getCurrentUser();
            Transaction transaction = tradingService.sellStock(currentUser.getId(), tradeRequest);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/portfolio")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserPortfolio() {
        try {
            User currentUser = authService.getCurrentUser();
            List<Portfolio> portfolio = tradingService.getUserPortfolio(currentUser.getId());
            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserTransactions() {
        try {
            User currentUser = authService.getCurrentUser();
            List<Transaction> transactions = tradingService.getUserTransactions(currentUser.getId());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getTradingSummary() {
        try {
            User currentUser = authService.getCurrentUser();
            
            BigDecimal portfolioValue = tradingService.calculatePortfolioValue(currentUser.getId());
            BigDecimal totalAssets = tradingService.calculateTotalAssets(currentUser.getId());
            
            Map<String, Object> summary = new HashMap<>();
            summary.put("virtualBalance", currentUser.getVirtualBalance());
            summary.put("portfolioValue", portfolioValue);
            summary.put("totalAssets", totalAssets);
            summary.put("totalProfit", totalAssets.subtract(new BigDecimal("10000.00")));
            
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
