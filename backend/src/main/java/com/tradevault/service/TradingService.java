package com.tradevault.service;

import com.tradevault.dto.StockPriceResponse;
import com.tradevault.dto.TradeRequest;
import com.tradevault.model.Portfolio;
import com.tradevault.model.Transaction;
import com.tradevault.model.User;
import com.tradevault.repository.PortfolioRepository;
import com.tradevault.repository.TransactionRepository;
import com.tradevault.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TradingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private StockService stockService;

    @Transactional
    public Transaction buyStock(Long userId, TradeRequest tradeRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockPriceResponse stockPrice = stockService.getStockPrice(tradeRequest.getSymbol());
        BigDecimal totalCost = stockPrice.getPrice().multiply(new BigDecimal(tradeRequest.getQuantity()));

        if (user.getVirtualBalance().compareTo(totalCost) < 0) {
            throw new RuntimeException("Insufficient balance for this purchase");
        }

        // Update user balance
        user.setVirtualBalance(user.getVirtualBalance().subtract(totalCost));
        userRepository.save(user);

        // Update or create portfolio entry
        Optional<Portfolio> existingPortfolio = portfolioRepository
                .findByUserIdAndStockSymbol(userId, tradeRequest.getSymbol());

        Portfolio portfolio;
        if (existingPortfolio.isPresent()) {
            portfolio = existingPortfolio.get();
            // Calculate new average buy price
            BigDecimal totalValue = portfolio.getAverageBuyPrice()
                    .multiply(new BigDecimal(portfolio.getQuantity()))
                    .add(totalCost);
            int totalQuantity = portfolio.getQuantity() + tradeRequest.getQuantity();
            portfolio.setAverageBuyPrice(totalValue.divide(new BigDecimal(totalQuantity), 2, BigDecimal.ROUND_HALF_UP));
            portfolio.setQuantity(totalQuantity);
        } else {
            portfolio = new Portfolio();
            portfolio.setUser(user);
            portfolio.setStockSymbol(tradeRequest.getSymbol());
            portfolio.setQuantity(tradeRequest.getQuantity());
            portfolio.setAverageBuyPrice(stockPrice.getPrice());
        }
        portfolioRepository.save(portfolio);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setSymbol(tradeRequest.getSymbol());
        transaction.setType(Transaction.TransactionType.BUY);
        transaction.setQuantity(tradeRequest.getQuantity());
        transaction.setPrice(stockPrice.getPrice());
        transactionRepository.save(transaction);

        return transaction;
    }

    @Transactional
    public Transaction sellStock(Long userId, TradeRequest tradeRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Portfolio> portfolioOpt = portfolioRepository
                .findByUserIdAndStockSymbol(userId, tradeRequest.getSymbol());

        if (portfolioOpt.isEmpty()) {
            throw new RuntimeException("You don't own any shares of " + tradeRequest.getSymbol());
        }

        Portfolio portfolio = portfolioOpt.get();

        if (portfolio.getQuantity() < tradeRequest.getQuantity()) {
            throw new RuntimeException("Insufficient shares for this sale");
        }

        StockPriceResponse stockPrice = stockService.getStockPrice(tradeRequest.getSymbol());
        BigDecimal totalRevenue = stockPrice.getPrice().multiply(new BigDecimal(tradeRequest.getQuantity()));

        // Update user balance
        user.setVirtualBalance(user.getVirtualBalance().add(totalRevenue));
        userRepository.save(user);

        // Update portfolio
        if (portfolio.getQuantity().equals(tradeRequest.getQuantity())) {
            // Sell all shares
            portfolioRepository.delete(portfolio);
        } else {
            portfolio.setQuantity(portfolio.getQuantity() - tradeRequest.getQuantity());
            portfolioRepository.save(portfolio);
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setSymbol(tradeRequest.getSymbol());
        transaction.setType(Transaction.TransactionType.SELL);
        transaction.setQuantity(tradeRequest.getQuantity());
        transaction.setPrice(stockPrice.getPrice());
        transactionRepository.save(transaction);

        return transaction;
    }

    public List<Portfolio> getUserPortfolio(Long userId) {
        return portfolioRepository.findByUserIdOrderByStockSymbol(userId);
    }

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public BigDecimal calculatePortfolioValue(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);
        BigDecimal totalValue = BigDecimal.ZERO;

        for (Portfolio portfolio : portfolios) {
            StockPriceResponse stockPrice = stockService.getStockPrice(portfolio.getStockSymbol());
            BigDecimal holdingValue = stockPrice.getPrice().multiply(new BigDecimal(portfolio.getQuantity()));
            totalValue = totalValue.add(holdingValue);
        }

        return totalValue;
    }

    public BigDecimal calculateTotalAssets(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal portfolioValue = calculatePortfolioValue(userId);
        return user.getVirtualBalance().add(portfolioValue);
    }
}
