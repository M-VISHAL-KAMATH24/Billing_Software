package com.kamaths.foodpoint.service;

import com.kamaths.foodpoint.dto.CreateOrderRequest;
import com.kamaths.foodpoint.entity.Order;
import com.kamaths.foodpoint.entity.OrderItem;
import com.kamaths.foodpoint.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    // ✅ FIXED createOrder - SAFE null handling (WORKS)
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        
        // Calculate total securely
        Double totalAmount = request.getOrderItems().stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
            
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setTotalAmount(totalAmount);
        order.setStatus("pending");
        
        // ✅ SAFE: Create NEW list for ElementCollection
        List<OrderItem> newItems = new ArrayList<>();
        if (request.getOrderItems() != null) {
            request.getOrderItems().forEach(dto -> {
                OrderItem item = new OrderItem();
                item.setItemName(dto.getItemName());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());
                newItems.add(item);
            });
        }
        order.setOrderItems(newItems); // ✅ setOrderItems() instead of add()
        
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc("pending");
    }
    
    public void deleteOrder(Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if ("pending".equals(order.getStatus())) {
                orderRepository.deleteById(id);
            }
        }
    }
    
    // ✅ FIXED updateOrder - NO .clear() on immutable ElementCollection
    public Order updateOrder(Long id, CreateOrderRequest request) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // ✅ CRITICAL FIX: Create NEW list (ElementCollection can't .clear())
        List<OrderItem> newItems = new ArrayList<>();
        if (request.getOrderItems() != null) {
            request.getOrderItems().forEach(dto -> {
                OrderItem item = new OrderItem();
                item.setItemName(dto.getItemName());
                item.setPrice(dto.getPrice());
                item.setQuantity(dto.getQuantity());
                newItems.add(item);
            });
        }
        
        // Recalculate total
        Double totalAmount = newItems.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setTotalAmount(totalAmount);
        order.setOrderItems(newItems); // ✅ Replaces entire collection - SAFE
        
        return orderRepository.save(order);
    }
    
    public Order markPaymentDone(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("paid");
        return orderRepository.save(order);
    }
}
