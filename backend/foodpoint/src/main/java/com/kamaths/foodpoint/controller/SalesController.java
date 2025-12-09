package com.kamaths.foodpoint.controller;

import com.kamaths.foodpoint.entity.Sale;
import com.kamaths.foodpoint.service.SalesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesController {
    
    private final SalesService salesService;
    
    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }
    
    // ✅ Today's sales
    @GetMapping("/today")
    public ResponseEntity<Double> getTodaySales() {
        return ResponseEntity.ok(salesService.getTodaySales());
    }
    
    // ✅ Total lifetime sales
    @GetMapping("/total")
    public ResponseEntity<Double> getTotalSales() {
        return ResponseEntity.ok(salesService.getTotalSales());
    }
    
    // ✅ Monthly sales
    @GetMapping("/monthly")
    public ResponseEntity<Double> getMonthlySales() {
        return ResponseEntity.ok(salesService.getMonthlySales());
    }
    
    // ✅ Recent sales (last 50 for charts)
    @GetMapping("/recent")
    public ResponseEntity<List<Sale>> getRecentSales() {
        return ResponseEntity.ok(salesService.getRecentSales(50));
    }
    
    // ✅ All sales
    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {
        return ResponseEntity.ok(salesService.getRecentSales(100));
    }
    
    // ✅ Weekly trend data
    @GetMapping("/trend")
    public ResponseEntity<List<Object[]>> getWeeklyTrend() {
        return ResponseEntity.ok(salesService.getWeeklySalesTrend());
    }
}
