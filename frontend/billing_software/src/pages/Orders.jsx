// src/pages/Orders.jsx - FULLY WORKING VERSION
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchMenuItems()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders/pending')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/food-items/menu')
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return
    try {
      await axios.delete(`http://localhost:8080/api/orders/${id}`)
      fetchOrders()
    } catch (error) {
      alert('Failed to delete order')
    }
  }

  const markPaymentDone = async (id) => {
    if (!window.confirm('Mark as paid? Order will be removed from list.')) return
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/payment-done`)
      fetchOrders()
      alert('✅ Payment marked & moved to sales!')
    } catch (error) {
      alert('Failed to update payment status')
    }
  }

  const openEditModal = (order) => {
    setEditingOrder(order)
    setOrderItems(order.orderItems.map(item => ({
      ...item,
      tempId: Date.now() + Math.random()
    })))
    setShowEditModal(true)
  }

  const addMenuItemToOrder = (menuItem) => {
    const newItem = {
      tempId: Date.now() + Math.random(),
      itemName: menuItem.name,
      price: menuItem.price,
      quantity: 1
    }
    setOrderItems([...orderItems, newItem])
  }

  const addManualItem = () => {
    const newItem = {
      tempId: Date.now() + Math.random(),
      itemName: '',
      price: '',
      quantity: 1
    }
    setOrderItems([...orderItems, newItem])
  }

  const updateOrderItem = (tempId, field, value) => {
    setOrderItems(orderItems.map(item => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ))
  }

  const removeOrderItem = (tempId) => {
    setOrderItems(orderItems.filter(item => item.tempId !== tempId))
  }

  const saveUpdatedOrder = async () => {
    if (orderItems.length === 0) {
      alert('Order must have at least one item')
      return
    }

    try {
      const totalAmount = orderItems.reduce((sum, item) => 
        sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0
      )

      const updatedOrderData = {
        customerName: editingOrder.customerName,
        customerPhone: editingOrder.customerPhone || '',
        paymentMethod: editingOrder.paymentMethod || 'cash',
        notes: editingOrder.notes || '',
        totalAmount,
        orderItems: orderItems.map(item => ({
          itemName: item.itemName || 'Custom item',
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1
        }))
      }

      console.log('Sending update:', updatedOrderData) // Debug

      await axios.put(`http://localhost:8080/api/orders/${editingOrder.id}`, updatedOrderData)
      
      setShowEditModal(false)
      setEditingOrder(null)
      setOrderItems([])
      fetchOrders()
      alert('✅ Order updated successfully!')
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message)
      alert('Failed to update order: ' + (error.response?.data || 'Check console'))
    }
  }

  const printBill = (order) => {
    const printWindow = window.open('', '_blank')
    const total = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    printWindow.document.write(`
      <html><head><title>Bill #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; max-width: 500px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #f97316; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .total { font-size: 24px; font-weight: bold; color: #059669; text-align: right; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style></head>
      <body>
        <div class="header">
          <div class="logo">🍽️ Kamaths Food Point</div>
          <div>Order #${order.id}</div>
          <div>${new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div><strong>Customer:</strong> ${order.customerName}</div>
        <div><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</div>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            ${order.orderItems.map(item => `
              <tr><td>${item.itemName}</td><td>${item.quantity}</td><td>₹${item.price}</td><td>₹${(item.price * item.quantity).toFixed(2)}</td></tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Total: ₹${total.toFixed(2)}</div>
        <div class="footer">Thank you for your order!</div>
      </body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.5rem' }}>Loading orders...</div>
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1f2937', marginBottom: '1rem' }}>
          📋 Pending Orders ({orders.length})
        </h1>
        <button 
          onClick={fetchOrders}
          style={{
            padding: '1rem 2rem', background: '#3b82f6', color: 'white',
            border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(59,130,246,0.3)'
          }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', zIndex: 1000,
          alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={() => setShowEditModal(false)}>
          <div style={{
            background: 'white', borderRadius: '24px', width: '100%', maxWidth: '1000px',
            maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ padding: '2rem 2.5rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', position: 'relative' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>
                Edit Order #{editingOrder.id} - {editingOrder.customerName}
              </h2>
              <button onClick={() => setShowEditModal(false)} style={{
                position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.2)',
                border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                color: 'white', fontSize: '1.5rem', cursor: 'pointer'
              }}>✕</button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2.5rem', maxHeight: '60vh', overflow: 'auto' }}>
              {/* Add Items Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <button 
                  onClick={() => setShowMenuModal(true)}
                  style={{
                    flex: 1, padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(16,185,129,0.3)'
                  }}
                >
                  📋 Add from Menu
                </button>
                <button 
                  onClick={addManualItem}
                  style={{
                    flex: 1, padding: '1rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  ➕ Add Manual Item
                </button>
              </div>

              {/* Current Total */}
              <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', 
                  padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>Current Total ({orderItems.length} items)</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>
                  ₹{orderItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0).toFixed(2)}
                </div>
              </div>

              {/* Items Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto', gap: '1rem', 
                  padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '12px', fontWeight: '700', color: '#374151', marginBottom: '1rem' }}>
                <span>Item Name</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Total</span>
                <span></span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflow: 'auto' }}>
                {orderItems.map((item) => (
                  <div key={item.tempId} style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto', gap: '1rem', 
                    padding: '1.25rem', background: 'white', borderRadius: '16px', 
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', alignItems: 'center'
                  }}>
                    <input 
                      value={item.itemName} 
                      onChange={(e) => updateOrderItem(item.tempId, 'itemName', e.target.value)}
                      placeholder="Item name"
                      style={{ 
                        padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '12px',
                        fontSize: '1rem', outline: 'none' 
                      }} 
                    />
                    <input 
                      type="number" 
                      value={item.price} 
                      onChange={(e) => updateOrderItem(item.tempId, 'price', e.target.value)}
                      min="0" step="0.01"
                      placeholder="0.00"
                      style={{ 
                        padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '12px',
                        fontSize: '1rem', textAlign: 'center', outline: 'none', width: '100px' 
                      }} 
                    />
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateOrderItem(item.tempId, 'quantity', e.target.value)}
                      min="1"
                      placeholder="1"
                      style={{ 
                        padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '12px',
                        fontSize: '1rem', textAlign: 'center', outline: 'none', width: '80px' 
                      }} 
                    />
                    <div style={{ 
                      fontSize: '1.1rem', fontWeight: '700', color: '#059669', textAlign: 'center' 
                    }}>
                      ₹{(parseFloat(item.price || 0) * parseInt(item.quantity || 1)).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeOrderItem(item.tempId)} 
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
                        border: 'none', borderRadius: '12px', width: '44px', height: '44px',
                        cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {orderItems.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '1.1rem' }}>
                    No items yet. Add from menu or manually.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '2rem 2.5rem', background: '#f8fafc', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowEditModal(false)} 
                style={{
                  padding: '1rem 2.5rem', background: '#f3f4f6', color: '#6b7280',
                  border: '2px solid #d1d5db', borderRadius: '16px', fontSize: '1.1rem',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={saveUpdatedOrder}
                disabled={orderItems.length === 0}
                style={{
                  padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', border: 'none', borderRadius: '16px', fontSize: '1.1rem',
                  fontWeight: '700', cursor: orderItems.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: orderItems.length === 0 ? 0.6 : 1
                }}
              >
                ✅ Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

              {/* Menu Modal */}
        {showMenuModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', zIndex: 1001,
            alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }} onClick={() => setShowMenuModal(false)}>
            <div style={{
              background: 'white', borderRadius: '24px', width: '90%', maxWidth: '700px',
              maxHeight: '70vh', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Menu Modal Header */}
              <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', position: 'relative' }}>
                <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>
                  📋 Add Items from Menu
                </h2>
                <button onClick={() => setShowMenuModal(false)} style={{
                  position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.2)',
                  border: 'none', borderRadius: '50%', width: '44px', height: '44px',
                  color: 'white', fontSize: '1.5rem', cursor: 'pointer'
                }}>✕</button>
              </div>

              {/* Menu Items Grid */}
              <div style={{ padding: '2rem', maxHeight: '50vh', overflow: 'auto' }}>
                {menuItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No menu items available
                  </div>
                ) : (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {menuItems.map((item) => (
                      <div key={item.id} 
                        onClick={() => addMenuItemToOrder(item)}
                        style={{
                          padding: '1.75rem', 
                          border: '3px solid #e5e7eb', 
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'white',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.08)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#3b82f6'
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(59,130,246,0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)'
                        }}
                      >
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: '#1f2937', 
                          marginBottom: '0.75rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.name}
                        </div>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '800', 
                          color: '#059669',
                          marginBottom: '0.5rem'
                        }}>
                          ₹{item.price}
                        </div>
                        <div style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '0.375rem 0.875rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          display: 'inline-block'
                        }}>
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

      {/* Orders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '2rem' }}>
        {orders.map((order) => {
          const total = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          
          return (
            <div key={order.id} style={{
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              padding: '2.5rem',
              border: '4px solid #f59e0b',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Order Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
              }}>
                ⏳ Pending
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '900', 
                    color: '#1f2937', 
                    marginBottom: '0.25rem',
                    lineHeight: '1.2'
                  }}>
                    {order.customerName}
                  </h3>
                  <div style={{ 
                    color: '#6b7280', 
                    fontSize: '1rem', 
                    marginBottom: '0.5rem'
                  }}>
                    Order #{order.id} • {new Date(order.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '2.25rem', 
                    fontWeight: '900', 
                    color: '#059669',
                    lineHeight: '1'
                  }}>
                    ₹{total.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {order.orderItems.length} items
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                {order.customerPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>📱</span>
                    <span style={{ fontWeight: '600' }}>{order.customerPhone}</span>
                  </div>
                )}
                {order.paymentMethod && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>💳</span>
                    <span style={{ fontWeight: '500', color: '#6b7280' }}>
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                )}
                {order.notes && (
                  <div style={{ marginTop: '0.75rem', fontStyle: 'italic', color: '#6b7280' }}>
                    📝 {order.notes}
                  </div>
                )}
              </div>

              {/* Quick Items Preview */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontWeight: '700', color: '#374151', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  Items ({order.orderItems.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '120px', overflow: 'hidden' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'rgba(248,250,252,0.8)',
                      borderRadius: '12px',
                      fontSize: '0.95rem'
                    }}>
                      <span style={{ flex: 1, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.itemName}
                      </span>
                      <span style={{ color: '#6b7280', minWidth: '50px' }}>
                        {item.quantity}x
                      </span>
                      <span style={{ fontWeight: '700', color: '#059669', minWidth: '70px' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '1rem' 
              }}>
                <button 
                  onClick={() => openEditModal(order)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  ➕ Add Items
                </button>
                <button 
                  onClick={() => printBill(order)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(245,158,11,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  🖨️ Print Bill
                </button>
                <button 
                  onClick={() => markPaymentDone(order.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(16,185,129,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  💰 Mark Paid
                </button>
                <button 
                  onClick={() => deleteOrder(order.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(239,68,68,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {orders.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '8rem 2rem', 
          color: '#6b7280',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📭</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
            No Pending Orders
          </h2>
          <p style={{ fontSize: '1.25rem' }}>
            All orders are completed or create new ones from{' '}
            <a href="/add-orders" style={{ color: '#3b82f6', fontWeight: '700' }}>
              Add Orders
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

