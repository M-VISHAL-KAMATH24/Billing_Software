// src/pages/AddOrders.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AddOrders() {
  const [orderItems, setOrderItems] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [showMenuModal, setShowMenuModal] = useState(false)
  
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  // Fetch menu items on load
  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/food-items/menu')
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoadingMenu(false)
    }
  }

  const addOrderItem = () => {
    const newId = Math.max(...orderItems.map(item => item.id), 0) + 1
    setOrderItems([...orderItems, { id: newId, itemName: '', price: '', quantity: 1 }])
  }

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id))
  }

  const updateOrderItem = (id, field, value) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  // Add menu item to order
  const addMenuItemToOrder = (menuItem) => {
    const existingIndex = orderItems.findIndex(item => item.itemName === menuItem.name)
    if (existingIndex >= 0) {
      // Increase quantity if exists
      updateOrderItem(orderItems[existingIndex].id, 'quantity', orderItems[existingIndex].quantity + 1)
    } else {
      // Add new item
      const newId = Math.max(...orderItems.map(item => item.id), 0) + 1
      setOrderItems([...orderItems, { 
        id: newId, 
        itemName: menuItem.name, 
        price: menuItem.price.toString(), 
        quantity: 1 
      }])
    }
    setShowMenuModal(false)
  }

  const totalAmount = orderItems.reduce((total, item) => {
    const price = parseFloat(item.price) || 0
    return total + (price * item.quantity)
  }, 0)

  const placeOrder = async (e) => {
    e.preventDefault()
    
    if (!customerName || orderItems.some(item => !item.itemName || !item.price)) {
      alert('Please fill customer name and all order items')
      return
    }

    try {
      const orderData = {
        customerName,
        customerPhone,
        paymentMethod,
        notes,
        totalAmount,
        orderItems: orderItems.map(item => ({
          itemName: item.itemName,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity)
        }))
      }

      await axios.post('http://localhost:8080/api/orders', orderData)
      
      alert('✅ Order placed successfully!')
      
      // Reset form
      setCustomerName('')
      setCustomerPhone('')
      setNotes('')
      setOrderItems([])
      
    } catch (error) {
      console.error('Order error:', error)
      alert('Failed to place order. Please try again.')
    }
  }

  return (
    <div style={{ 
      padding: '2rem 1rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, white, #f0f9ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🛒 New Order
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)' }}>
          Quick order entry for customers
        </p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden',
        maxWidth: '1200px',
        margin: '0 auto 2rem'
      }}>
        {/* Customer Info */}
        <div style={{ padding: '2.5rem' }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            👤 Customer Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%', padding: '1rem 1.25rem', border: '2px solid #e5e7eb',
                  borderRadius: '16px', fontSize: '1rem', outline: 'none',
                  transition: 'all 0.3s ease', background: 'white'
                }}
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{
                  width: '100%', padding: '1rem 1.25rem', border: '2px solid #e5e7eb',
                  borderRadius: '16px', fontSize: '1rem', outline: 'none',
                  transition: 'all 0.3s ease', background: 'white'
                }}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Payment Method *
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['cash', 'card', 'UPI', 'wallet'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: '500', color: '#374151' }}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ padding: '0 2.5rem 2.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              🍔 Order Items ({orderItems.length})
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowMenuModal(true)}
                disabled={loadingMenu}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loadingMenu ? 'not-allowed' : 'pointer',
                  opacity: loadingMenu ? 0.6 : 1
                }}
              >
                📋 Choose from Menu
              </button>
              <button
                onClick={addOrderItem}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ➕ Manual Entry
              </button>
            </div>
          </div>

          {orderItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.1rem' }}>No items added yet</p>
              <p>Click "Choose from Menu" or "Manual Entry" to add items</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orderItems.map((item) => (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 40px',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '1.25rem',
                  background: 'rgba(248, 250, 252, 0.7)',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.itemName}
                    onChange={(e) => updateOrderItem(item.id, 'itemName', e.target.value)}
                    style={{
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateOrderItem(item.id, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                    style={{
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    style={{
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      textAlign: 'center',
                      outline: 'none',
                      width: '60px'
                    }}
                  />
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    color: '#059669',
                    textAlign: 'center'
                  }}>
                    ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeOrderItem(item.id)}
                    style={{
                      width: '40px', height: '40px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '1.1rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Total & Notes & Submit */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, marginRight: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Special Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Extra spicy, no onions, etc..."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                fontSize: '1rem',
                resize: 'vertical',
                outline: 'none',
                background: 'white'
              }}
            />
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '2rem',
            borderRadius: '24px',
            textAlign: 'center',
            minWidth: '250px',
            boxShadow: '0 15px 35px rgba(245, 158, 11, 0.4)'
          }}>
            <div style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Amount</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1' }}>
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '1.25rem 3rem',
              background: 'rgba(156, 163, 175, 0.2)',
              color: '#6b7280',
              border: '2px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '200px'
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={placeOrder}
            disabled={!customerName || orderItems.length === 0}
            style={{
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '200px',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
              opacity: (!customerName || orderItems.length === 0) ? 0.6 : 1
            }}
          >
            ✅ Place Order
          </button>
        </div>
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowMenuModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '90vw',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>
                📋 Choose from Menu
              </h2>
              <button
                onClick={() => setShowMenuModal(false)}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  right: '2rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '0 2rem 2rem' }}>
              {loadingMenu ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading menu...</div>
              ) : menuItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No menu items available
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  {menuItems.map((item) => (
                    <div key={item.id} style={{
                      padding: '1.5rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }} onClick={() => addMenuItemToOrder(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>
                        ₹{item.price}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {item.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}