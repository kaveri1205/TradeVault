package com.tradevault.dto;

import java.math.BigDecimal;

public class StockPriceResponse {
    
    private String symbol;
    private String name;
    private BigDecimal price;
    private String currency;
    private long timestamp;
    
    public StockPriceResponse() {}
    
    public StockPriceResponse(String symbol, String name, BigDecimal price, String currency) {
        this.symbol = symbol;
        this.name = name;
        this.price = price;
        this.currency = currency;
        this.timestamp = System.currentTimeMillis();
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
