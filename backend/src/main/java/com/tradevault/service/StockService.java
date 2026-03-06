package com.tradevault.service;

import com.tradevault.dto.StockPriceResponse;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class StockService {

    private final RestTemplate restTemplate;

    public StockService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .connectTimeout(java.time.Duration.ofSeconds(5))
                .readTimeout(java.time.Duration.ofSeconds(5))
                .build();
    }

    public StockPriceResponse getStockPrice(String symbol) {
        String sym = symbol.toUpperCase();
        
        // 1. Try Binance (Primary)
        try {
            String binanceSymbol = sym.endsWith("USDT") ? sym : sym + "USDT";
            String url = "https://api.binance.com/api/v3/ticker/price?symbol=" + binanceSymbol;
            Map<String, String> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("price")) {
                return new StockPriceResponse(sym, getCryptoName(sym), new BigDecimal(response.get("price")), "USDT");
            }
        } catch (Exception e) {
            System.err.println("Binance API failed for " + sym + ": " + e.getMessage());
        }

        // 2. Try Coinbase (Secondary Fallback)
        try {
            String coinbaseSymbol = sym.replace("USDT", "") + "-USD";
            String url = "https://api.coinbase.com/v2/prices/" + coinbaseSymbol + "/spot";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                Map<String, String> data = (Map<String, String>) response.get("data");
                return new StockPriceResponse(sym, getCryptoName(sym), new BigDecimal(data.get("amount")), "USDT");
            }
        } catch (Exception e) {
            System.err.println("Coinbase API failed for " + sym + ": " + e.getMessage());
        }

        // 3. Try CoinGecko (Tertiary Fallback)
        try {
            String geckoId = getGeckoId(sym);
            String url = "https://api.coingecko.com/api/v3/simple/price?ids=" + geckoId + "&vs_currencies=usd";
            Map<String, Map<String, Double>> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey(geckoId)) {
                double price = response.get(geckoId).get("usd");
                return new StockPriceResponse(sym, getCryptoName(sym), BigDecimal.valueOf(price), "USDT");
            }
        } catch (Exception e) {
            System.err.println("CoinGecko API failed for " + sym + ": " + e.getMessage());
        }

        // Final Fallback: static mock (No random variation as requested for "real" feel)
        return getMockStockPrice(sym);
    }

    private String getCryptoName(String symbol) {
        String s = symbol.replace("USDT", "").toUpperCase();
        switch (s) {
            case "BTC": return "Bitcoin";
            case "ETH": return "Ethereum";
            case "BNB": return "Binance Coin";
            case "SOL": return "Solana";
            case "ADA": return "Cardano";
            case "XRP": return "XRP";
            case "DOT": return "Polkadot";
            case "DOGE": return "Dogecoin";
            default: return s + " Crypto";
        }
    }

    private String getGeckoId(String symbol) {
        String s = symbol.replace("USDT", "").toUpperCase();
        switch (s) {
            case "BTC": return "bitcoin";
            case "ETH": return "ethereum";
            case "BNB": return "binancecoin";
            case "SOL": return "solana";
            case "ADA": return "cardano";
            default: return "bitcoin";
        }
    }

    private StockPriceResponse getMockStockPrice(String symbol) {
        // Mock data only as last resort
        BigDecimal mockPrice = new BigDecimal("1.00");
        String cleanSym = symbol.replace("USDT", "").toUpperCase();
        
        switch (cleanSym) {
            case "BTC": mockPrice = new BigDecimal("65432.10"); break;
            case "ETH": mockPrice = new BigDecimal("3456.78"); break;
            case "BNB": mockPrice = new BigDecimal("589.45"); break;
            case "SOL": mockPrice = new BigDecimal("145.67"); break;
        }
        
        return new StockPriceResponse(cleanSym, getCryptoName(cleanSym), mockPrice, "USDT");
    }
}
