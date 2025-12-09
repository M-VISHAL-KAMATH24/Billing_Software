package com.kamaths.foodpoint.service;

import com.kamaths.foodpoint.entity.Sale;
import com.kamaths.foodpoint.repository.SalesRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class SalesService {
    
    private final SalesRepository salesRepository;
    
    public SalesService(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }
    
    // ✅ THIS IS THE MISSING PIECE!
    public void addSale(Double amount) {
        if (amount != null && amount > 0) {
            Sale sale = new Sale();
            sale.setAmount(amount);
            sale.setCreatedAt(LocalDateTime.now());
            salesRepository.save(sale);
        }
    }
    
    public Double getTodaySales() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        Double result = salesRepository.sumAmountByCreatedAtBetween(startOfDay, endOfDay);
        return result != null ? result : 0.0;
    }
    
    public Double getTotalSales() {
        Double result = salesRepository.sumAllAmount();
        return result != null ? result : 0.0;
    }
    
    public Double getMonthlySales() {
        LocalDateTime startOfMonth = LocalDateTime.now()
            .with(TemporalAdjusters.firstDayOfMonth())
            .with(LocalTime.MIN);
        LocalDateTime endOfMonth = LocalDateTime.now()
            .with(TemporalAdjusters.lastDayOfMonth())
            .with(LocalTime.MAX);
        Double result = salesRepository.sumAmountByCreatedAtBetween(startOfMonth, endOfMonth);
        return result != null ? result : 0.0;
    }
    
    public List<Sale> getRecentSales(int limit) {
        return salesRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Object[]> getWeeklySalesTrend() {
        return salesRepository.getWeeklySalesTrend();
    }
}
