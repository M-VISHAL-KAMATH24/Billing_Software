package com.kamaths.foodpoint.service;

import com.kamaths.foodpoint.entity.Sale;
import com.kamaths.foodpoint.repository.SalesRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class SalesService {
    
    private final SalesRepository salesRepository;
    
    public SalesService(SalesRepository salesRepository) {
        this.salesRepository = salesRepository;
    }
    
    public void addSale(Double amount) {
        if (amount != null && amount > 0) {
            Sale sale = new Sale(amount);
            salesRepository.save(sale);
        }
    }
    
    public Double getTodaySales() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        return salesRepository.sumAmountByCreatedAtBetween(startOfDay, endOfDay);
    }
    
    public Double getTotalSales() {
        return salesRepository.sumAmountByCreatedAtBetween(
            LocalDateTime.now().minusYears(100), 
            LocalDateTime.now()
        );
    }
    
    public List<Sale> getRecentSales(int limit) {
        return salesRepository.findAllByOrderByCreatedAtDesc().stream()
            .limit(limit)
            .toList();
    }
    
    public List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end) {
        return salesRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
    }
    
    public Double getSalesByDateRangeSum(LocalDateTime start, LocalDateTime end) {
        return salesRepository.sumAmountByCreatedAtBetween(start, end);
    }
}
