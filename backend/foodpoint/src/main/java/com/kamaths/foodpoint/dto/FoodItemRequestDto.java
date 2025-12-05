package com.kamaths.foodpoint.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FoodItemRequestDto {
    private String name;
    private String category;
    private Double price;
    private MultipartFile image;
}
