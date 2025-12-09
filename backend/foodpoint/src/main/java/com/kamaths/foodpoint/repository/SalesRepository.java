package com.kamaths.foodpoint.repository;

import com.kamaths.foodpoint.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sale, Long> {
    
    // Today's sales
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sale s WHERE s.createdAt >= ?1 AND s.createdAt < ?2")
    Double sumAmountByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // All sales
    List<Sale> findAllByOrderByCreatedAtDesc();
    
    // Sales by date range
    List<Sale> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}
