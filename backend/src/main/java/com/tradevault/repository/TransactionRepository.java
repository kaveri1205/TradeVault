package com.tradevault.repository;

import com.tradevault.model.Transaction;
import com.tradevault.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUser(User user);
    
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByUserOrderByTimestampDesc(User user);
    
    List<Transaction> findByUserIdOrderByTimestampDesc(Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.id = ?1 AND t.symbol = ?2 ORDER BY t.timestamp DESC")
    List<Transaction> findByUserIdAndSymbolOrderByTimestampDesc(Long userId, String symbol);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = ?1")
    Long countByUserId(Long userId);
}
