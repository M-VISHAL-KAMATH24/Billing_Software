package com.kamaths.foodpoint.repository;

import com.kamaths.foodpoint.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesRepository extends JpaRepository<Sale, Long> {
    
    // ✅ Sum sales by date range - UNCHANGED
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sale s WHERE s.createdAt >= :start AND s.createdAt < :end")
    Double sumAmountByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    // ✅ Total lifetime sales - UNCHANGED
    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sale s")
    Double sumAllAmount();
    
    // ✅ All sales ordered by date - UNCHANGED
    List<Sale> findAllByOrderByCreatedAtDesc();
    
    // ✅ FIXED: H2 Compatible - Last 7 days using native query
    @Query(value = "SELECT DATE(created_at), COALESCE(SUM(amount), 0) FROM sale " +
           "WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) " +
           "GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC", nativeQuery = true)
    List<Object[]> getWeeklySalesTrend();
}
