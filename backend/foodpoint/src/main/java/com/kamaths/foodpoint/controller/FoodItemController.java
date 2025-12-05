package com.kamaths.foodpoint.controller;

import com.kamaths.foodpoint.dto.FoodItemRequestDto;
import com.kamaths.foodpoint.entity.FoodItem;
import com.kamaths.foodpoint.service.FoodItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodItemController {
    
    private final FoodItemService foodItemService;
    
    // ✅ Constructor injection (Lombok @RequiredArgsConstructor can also work)
    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }
    
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<FoodItem> createFoodItem(@ModelAttribute FoodItemRequestDto dto) throws IOException {
        FoodItem saved = foodItemService.createFoodItem(dto);
        return ResponseEntity.ok(saved);
    }
    
    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        return ResponseEntity.ok(foodItemService.getAllFoodItems()); // ✅ Now works
    }
}
