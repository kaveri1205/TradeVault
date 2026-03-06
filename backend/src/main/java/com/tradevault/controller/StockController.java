package com.tradevault.controller;

import com.tradevault.dto.StockPriceResponse;
import com.tradevault.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stocks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/search/{symbol}")
    public ResponseEntity<?> getCryptoPrice(@PathVariable String symbol) {
        try {
            StockPriceResponse cryptoPrice = stockService.getStockPrice(symbol);
            return ResponseEntity.ok(cryptoPrice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
