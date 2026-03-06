package com.tradevault.repository;

import com.tradevault.model.Portfolio;
import com.tradevault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    
    List<Portfolio> findByUser(User user);
    
    List<Portfolio> findByUserId(Long userId);
    
    Optional<Portfolio> findByUserAndStockSymbol(User user, String stockSymbol);
    
    Optional<Portfolio> findByUserIdAndStockSymbol(Long userId, String stockSymbol);
    
    @Query("SELECT p FROM Portfolio p WHERE p.user.id = ?1 ORDER BY p.stockSymbol")
    List<Portfolio> findByUserIdOrderByStockSymbol(Long userId);
}
