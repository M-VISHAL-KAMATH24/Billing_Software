package com.kamaths.foodpoint.dto;

public class OrderItemDto {
    private String itemName;
    private Double price;
    private Integer quantity;
    
    // Default constructor
    public OrderItemDto() {}
    
    // Constructor
    public OrderItemDto(String itemName, Double price, Integer quantity) {
        this.itemName = itemName;
        this.price = price;
        this.quantity = quantity;
    }
    
    // Getters & Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
