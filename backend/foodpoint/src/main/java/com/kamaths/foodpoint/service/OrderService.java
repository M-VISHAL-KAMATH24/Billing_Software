package com.kamaths.foodpoint.service;

import com.kamaths.foodpoint.dto.CreateOrderRequest;
import com.kamaths.foodpoint.entity.Order;
import com.kamaths.foodpoint.entity.OrderItem;
import com.kamaths.foodpoint.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    public Order createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());
        order.setTotalAmount(request.getTotalAmount());
        order.setOrderItems(request.getOrderItems().stream()
            .map(item -> new OrderItem(item.getItemName(), item.getPrice(), item.getQuantity()))
            .toList());
        
        return orderRepository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatusOrderByCreatedAtDesc("pending");
    }
}
