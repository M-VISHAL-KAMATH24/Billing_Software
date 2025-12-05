package com.kamaths.foodpoint.controller;

import com.kamaths.foodpoint.dto.FoodItemRequestDto;
import com.kamaths.foodpoint.entity.FoodItem;
import com.kamaths.foodpoint.service.FoodItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodItemController {
    
    private final FoodItemService foodItemService;
    
    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }
    
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<FoodItem> createFoodItem(@ModelAttribute FoodItemRequestDto dto) throws Exception {
        FoodItem saved = foodItemService.createFoodItem(dto);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodItemService.getAllFoodItems());
    }

    @GetMapping("/menu")
public ResponseEntity<List<FoodItem>> getMenuItems() {
    return ResponseEntity.ok(foodItemService.getAllFoodItems());
}
    // ✅ NEW DELETE ENDPOINT
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        try {
            boolean deleted = foodItemService.deleteFoodItem(id);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete item: " + e.getMessage());
        }
    }
}
