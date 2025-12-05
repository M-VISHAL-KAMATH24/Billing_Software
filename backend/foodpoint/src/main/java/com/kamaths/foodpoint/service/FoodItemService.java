package com.kamaths.foodpoint.service;

import com.kamaths.foodpoint.dto.FoodItemRequestDto;
import com.kamaths.foodpoint.entity.FoodItem;
import com.kamaths.foodpoint.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FoodItemService {
    
    private final FoodItemRepository foodItemRepository;
    
    @Value("${app.upload.dir:/uploads}")
    private String uploadDir;
    
    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }
    
    public FoodItem createFoodItem(FoodItemRequestDto dto) throws IOException {
        String imageUrl = saveImage(dto.getImage());
        
        FoodItem foodItem = new FoodItem();
        foodItem.setName(dto.getName());
        foodItem.setCategory(dto.getCategory());
        foodItem.setPrice(dto.getPrice());
        foodItem.setImageUrl(imageUrl);
        
        return foodItemRepository.save(foodItem);
    }
    
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }
    
    // ✅ NEW DELETE METHOD
    public boolean deleteFoodItem(Long id) {
        Optional<FoodItem> foodItemOpt = foodItemRepository.findById(id);
        if (foodItemOpt.isPresent()) {
            FoodItem foodItem = foodItemOpt.get();
            
            // Delete image file if exists
            if (foodItem.getImageUrl() != null && !foodItem.getImageUrl().isEmpty()) {
                try {
                    Path imagePath = Paths.get(uploadDir + foodItem.getImageUrl());
                    Files.deleteIfExists(imagePath);
                } catch (IOException e) {
                    // Log but don't fail deletion if image can't be deleted
                    System.err.println("Failed to delete image: " + foodItem.getImageUrl() + " - " + e.getMessage());
                }
            }
            
            foodItemRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, image.getBytes());
        
        return "/uploads/" + fileName;
    }
}
