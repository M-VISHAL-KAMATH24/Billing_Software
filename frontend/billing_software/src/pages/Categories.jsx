// src/pages/Categories.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Categories() {
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchFoodItems()
  }, [])

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/food-items')
      setFoodItems(response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteFoodItem = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this item?`)) return
    
    try {
      await axios.delete(`http://localhost:8080/api/food-items/${id}`)
      setFoodItems(prevItems => prevItems.filter(item => item.id !== id))
      console.log('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  const sortedItems = foodItems
    .filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return a.name.localeCompare(b.name)
    })

  // Group by category
  const groupedItems = sortedItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const categoryOrder = ['chats', 'juice', 'burgers', 'breakfast', 'special items']

  // Category styling config
  const categoryStyles = {
    'juice': {
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
      icon: '🧃',
      shadowColor: 'rgba(16, 185, 129, 0.4)'
    },
    'special items': {
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
      icon: '⭐',
      shadowColor: 'rgba(139, 92, 246, 0.4)'
    },
    'chats': {
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
      icon: '☕',
      shadowColor: 'rgba(245, 158, 11, 0.4)'
    },
    'burgers': {
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
      icon: '🍔',
      shadowColor: 'rgba(239, 68, 68, 0.4)'
    },
    'breakfast': {
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
      icon: '🥐',
      shadowColor: 'rgba(249, 115, 22, 0.4)'
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'center', 
        minHeight: '60vh', fontSize: '1.5rem', color: '#6b7280' 
      }}>
        Loading food items...
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '2rem 1rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          textShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
        }}>
          🍽️ Food Categories
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
          {foodItems.length} delicious items available
        </p>
      </div>

      {/* Search & Sort */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '3rem', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '1.5rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ position: 'relative', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '1rem 1.5rem 1rem 3rem',
              border: '2px solid transparent',
              borderRadius: '16px', 
              fontSize: '1rem', 
              width: '100%',
              background: 'white',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'transparent'
              e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
            }}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '1rem 1.5rem',
            border: '2px solid transparent',
            borderRadius: '16px', 
            fontSize: '1rem', 
            background: 'white',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em'
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#3b82f6'
            e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = 'transparent'
            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price (Low-High)</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      {/* No items */}
      {sortedItems.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '6rem 2rem', 
          color: '#6b7280',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No items found</h3>
          <p>Add some food items from <a href="/add-categories" style={{ color: '#3b82f6', fontWeight: '600' }}>Add Categories</a></p>
        </div>
      )}

      {/* Category Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {categoryOrder.map((category) => {
          const categoryItems = groupedItems[category] || []
          if (categoryItems.length === 0) return null
          
          const styleConfig = categoryStyles[category] || categoryStyles['chats']

          return (
            <section key={category}>
              {/* Smaller Category Header */}
              <div style={{
                background: styleConfig.gradient,
                color: 'white', 
                padding: '1.5rem 2rem',
                borderRadius: '20px',
                marginBottom: '1.5rem', 
                boxShadow: `0 20px 40px ${styleConfig.shadowColor}`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  lineHeight: '1'
                }}>
                  {styleConfig.icon}
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '800', 
                    margin: 0,
                    lineHeight: '1.2'
                  }}>
                    {category.replace(/\b\w/g, l => l.toUpperCase()).replace('Chats', 'Chats')}
                  </h2>
                  <p style={{ 
                    margin: '0.25rem 0 0', 
                    fontSize: '1rem', 
                    opacity: 0.95,
                    fontWeight: '500'
                  }}>
                    {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '120px',
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                }} />
              </div>
              
              {/* Smaller Category Items Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {categoryItems.map((item) => (
                  <div 
                    key={item.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                      overflow: 'hidden', 
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative'
                    }} 
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)'
                      e.currentTarget.style.boxShadow = `0 25px 50px ${styleConfig.shadowColor}, 0 0 0 1px rgba(255,255,255,0.9)`
                    }} 
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.2)'
                    }}>
                    
                    {/* Smaller Item Image */}
                    <div style={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: '160px',
                      overflow: 'hidden'
                    }}>
                      {item.imageUrl ? (
                        <>
                          <img 
                            src={`http://localhost:8080${item.imageUrl}`}
                            alt={item.name}
                            style={{
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '100%', 
                          height: '100%', 
                          background: styleConfig.gradient,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <span style={{ 
                            fontSize: '2.5rem', 
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                          }}>
                            {styleConfig.icon}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Compact Item Content */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem', 
                        fontWeight: '800', 
                        color: '#1f2937',
                        margin: '0 0 0.5rem 0', 
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.name}
                      </h3>
                      
                      <div style={{
                        fontSize: '1.25rem', 
                        fontWeight: '800', 
                        background: styleConfig.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '0.75rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        ₹{item.price}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{
                          background: styleConfig.gradient,
                          color: 'white',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '16px', 
                          fontSize: '0.8rem', 
                          fontWeight: '700',
                          boxShadow: `0 4px 12px ${styleConfig.shadowColor}`
                        }}>
                          {item.category.replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: styleConfig.gradient
                        }} />
                      </div>
                      
                      {/* Action Buttons Row */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Add to Cart Button */}
                        <button style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          background: styleConfig.gradient,
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: `0 6px 20px ${styleConfig.shadowColor}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)'
                          e.target.style.boxShadow = `0 12px 30px ${styleConfig.shadowColor}`
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)'
                          e.target.style.boxShadow = `0 6px 20px ${styleConfig.shadowColor}`
                        }}>
                          Add to Cart
                        </button>
                        
                        {/* Delete Button */}
                        <button 
                          onClick={() => deleteFoodItem(item.id)}
                          style={{
                            width: '44px',
                            height: '44px',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.1)'
                            e.target.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.6)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)'
                            e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
