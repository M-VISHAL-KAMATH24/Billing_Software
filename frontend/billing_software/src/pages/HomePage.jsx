// src/pages/HomePage.jsx - BULLETPROOF VERSION
import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [floatingShapes, setFloatingShapes] = useState([])
  const rafRef = useRef(null)
  const animationRef = useRef(0)

  // Create initial shapes safely
  const createShapes = useCallback(() => {
    const shapes = []
    for (let i = 0; i < 12; i++) {
      shapes.push({
        id: i,
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        size: 20 + Math.random() * 40,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 1.5,
        color: ['#f97316', '#10b981', '#3b82f6', '#ef4444', '#f59e0b'][Math.floor(Math.random() * 5)]
      })
    }
    return shapes
  }, [])

  // Animation loop - optimized
  const animateShapes = useCallback(() => {
    setFloatingShapes(prevShapes => {
      if (!prevShapes?.length) return prevShapes
      
      const width = window.innerWidth
      const height = window.innerHeight
      
      return prevShapes.map(shape => {
        let x = shape.x + shape.speedX
        let y = shape.y + shape.speedY
        let speedX = shape.speedX
        let speedY = shape.speedY
        
        // Boundary bounce
        if (x < 0) { x = 0; speedX = -speedX }
        if (x > width - shape.size) { x = width - shape.size; speedX = -speedX }
        if (y < 0) { y = 0; speedY = -speedY }
        if (y > height - shape.size) { y = height - shape.size; speedY = -speedY }
        
        return {
          ...shape,
          x,
          y,
          rotation: shape.rotation + shape.rotSpeed,
          speedX,
          speedY
        }
      })
    })
    
    animationRef.current = requestAnimationFrame(animateShapes)
  }, [])

  useEffect(() => {
    // Initialize shapes
    setFloatingShapes(createShapes())
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateShapes)
    
    // Handle resize
    const handleResize = () => {
      setFloatingShapes(prev => prev || [])
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [createShapes, animateShapes])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Floating Shapes */}
      {floatingShapes.map(shape => (
        <div
          key={shape.id}
          style={{
            position: 'fixed',
            left: `${shape.x}px`,
            top: `${shape.y}px`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            background: `radial-gradient(circle at 30% 30%, ${shape.color}44 0%, ${shape.color}22 50%, transparent 70%)`,
            borderRadius: '50%',
            transform: `rotate(${shape.rotation}deg)`,
            zIndex: 1,
            pointerEvents: 'none',
            boxShadow: `0 2px 10px ${shape.color}33`
          }}
        />
      ))}

      {/* Navigation Buttons */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 100,
        display: 'flex',
        gap: '1rem'
      }}>
        <Link 
          to="/add-orders" 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#f97316',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}
        >
          ➕ New Order
        </Link>
        <Link 
          to="/orders" 
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}
        >
          📋 Orders
        </Link>
      </div>

      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 2rem 6rem', 
        maxWidth: '1400px', 
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 6rem)', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #1f2937 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          lineHeight: 1.1
        }}>
          🍽️ Kamaths Food Point
        </h1>
        <p style={{ 
          fontSize: 'clamp(1.3rem, 3vw, 2rem)', 
          color: '#374151',
          maxWidth: '600px',
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Authentic Mangalorean Flavors Since 1995
        </p>
       <div style={{
  padding: '8rem 2rem 6rem',
  maxWidth: '1400px',
  margin: '0 auto',
  textAlign: 'center',
  position: 'relative'
}}>
  {/* Decorative Background Elements */}
  <div style={{
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, #f9731622 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 1
  }} />
  <div style={{
    position: 'absolute',
    bottom: '-80px',
    left: '-80px',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, #10b98122 0%, transparent 70%)',
    borderRadius: '50%',
    zIndex: 1
  }} />

  {/* Main Content */}
  <div style={{ position: 'relative', zIndex: 10 }}>
    {/* Logo/Icon */}
    <div style={{
      width: '120px',
      height: '120px',
      margin: '0 auto 2rem',
      background: 'linear-gradient(135deg, #f97316, #ef4444)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '4rem',
      color: 'white',
      boxShadow: '0 30px 60px rgba(249,115,22,0.4)',
      animation: 'pulse 3s infinite'
    }}>
      🍽️
    </div>

    {/* Welcome Title */}
    <h1 style={{
      fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #1f2937 0%, #f97316 50%, #ef4444 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em'
    }}>
      Welcome to
    </h1>
    
    <h2 style={{
      fontSize: 'clamp(3.5rem, 9vw, 6.5rem)',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #f97316, #10b981, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      lineHeight: 1
    }}>
      Kamaths Food Point
    </h2>

    {/* Subtitle */}
    <p style={{
      fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
      color: '#374151',
      maxWidth: '700px',
      margin: '0 auto 3rem',
      lineHeight: 1.5,
      fontWeight: '400'
    }}>
      Professional <strong>Billing & Order Management</strong> System
    </p>

    {/* Stats Cards */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '2rem',
      maxWidth: '900px',
      margin: '3rem auto 0'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, #f97316, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
          ⚡
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Fast Billing
        </h3>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
          Lightning quick order processing
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
          📊
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Real-time Tracking
        </h3>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
          Live order & payment status
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '3.5rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
          🖨️
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1f2937', marginBottom: '0.5rem' }}>
          Instant Print
        </h3>
        <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
          Professional bill printing
        </p>
      </div>
    </div>

    {/* Bottom Badge */}
    <div style={{
      marginTop: '4rem',
      padding: '1.5rem 3rem',
      background: 'linear-gradient(135deg, rgba(31,41,55,0.9), rgba(17,24,39,0.9))',
      borderRadius: '24px',
      color: 'white',
      backdropFilter: 'blur(20px)',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
        Powered by Modern Technology
      </div>
      <div style={{ opacity: 0.9, fontSize: '1rem' }}>
        Built for Kamaths Food Point • Mangalore 2025
      </div>
    </div>
  </div>
</div>

<style jsx>{`
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`}</style>

      </section>

      {/* Owners Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'rgba(255,255,255,0.95)',
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '4rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 1.5rem',
              background: `url('https://images.unsplash.com/photo-1615484473779-b15846e08885?w=300') center/cover`,
              borderRadius: '50%',
              border: '6px solid #f97316',
              boxShadow: '0 20px 40px rgba(249,115,22,0.3)'
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              👨‍🍳 Mr. Manjunath Kamath
            </h3>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: 1.6 }}>
              25+ years perfecting authentic Mangalorean recipes. 
              Master of Chicken Ghee Roast & traditional curries.
            </p>
          </div>
          <div>
            <div style={{
              width: '200px',
              height: '200px',
              margin: '0 auto 1.5rem',
              background: `url('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300') center/cover`,
              borderRadius: '50%',
              border: '6px solid #10b981',
              boxShadow: '0 20px 40px rgba(16,185,129,0.3)'
            }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: '#1f2937', 
              marginBottom: '1rem' 
            }}>
              👩‍🍳 Divya Kamath
            </h3>
                        <p style={{ color: '#6b7280', fontSize: '1.1rem', lineHeight: 1.6 }}>
              Heart of our kitchen. Signature neer dosas & coconut curries. 
              Brings love to every plate since 1995.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        background: 'linear-gradient(135deg, #10b98122, #3b82f622)',
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h2 style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              fontWeight: '800', 
              color: '#059669',
              marginBottom: '1.5rem'
            }}>
              🏪 Our Legacy
            </h2>
            <div style={{ 
              fontSize: '1.3rem', 
              color: '#1f2937', 
              lineHeight: 1.7,
              marginBottom: '2rem'
            }}>
              <strong>Est. 1995</strong> - Serving authentic <em>Mangalorean cuisine</em> 
              with family recipes perfected over generations. From fiery 
              <strong>Chicken Ghee Roast</strong> to crispy <strong>Neer Dosa</strong>.
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐⭐⭐⭐⭐</div>
                <div style={{ fontWeight: '700', color: '#1f2937' }}>5.0</div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Local Favorite</div>
              </div>
              <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2.5rem', color: '#f97316' }}>🍽️</div>
                <div style={{ fontWeight: '700', color: '#1f2937' }}>100+</div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Daily Orders</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100%',
              height: '400px',
              background: 'linear-gradient(45deg, #f97316, #ef4444, #10b981)',
              borderRadius: '30px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800') center/cover`,
                filter: 'brightness(0.8) contrast(1.1)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                padding: '2rem',
                color: 'white'
              }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  📍 Kamaths Food Point
                </h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Mangalore's Favorite Since 1995</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        background: 'rgba(31,41,55,0.95)',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: '900', 
            marginBottom: '1.5rem'
          }}>
            Ready For Your Order?
          </h2>
          <p style={{ 
            fontSize: '1.4rem', 
            opacity: 0.9,
            marginBottom: '3rem',
            lineHeight: 1.6
          }}>
            Experience authentic Mangalorean flavors delivered fresh
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/add-orders" style={{
              padding: '1.5rem 3rem',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '800',
              boxShadow: '0 25px 50px rgba(249,115,22,0.4)',
              letterSpacing: '1px'
            }}>
              🍽️ Place Order Now
            </Link>
            <Link to="/orders" style={{
              padding: '1.5rem 3rem',
              background: 'transparent',
              color: 'white',
              border: '3px solid white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              📋 Manage Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer style={{ 
        background: '#111827',
        color: '#d1d5db',
        padding: '4rem 2rem 2rem'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          textAlign: 'center' 
        }}>
          <h3 style={{ 
            fontSize: '2.5rem', 
            background: 'linear-gradient(135deg, #f97316, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '900',
            marginBottom: '1rem'
          }}>
            🍽️ Kamaths Food Point
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            maxWidth: '800px',
            margin: '2rem auto'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', color: '#f97316', marginBottom: '0.5rem' }}>📍 Location</div>
              <p>Near City Center, Mangalore</p>
              <p style={{ color: '#10b981', fontWeight: '600' }}>Open: 7AM - 11PM Daily</p>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', color: '#f97316', marginBottom: '0.5rem' }}>📞 Contact</div>
              <p style={{ color: '#f3f4f6', fontWeight: '700', fontSize: '1.2rem' }}>+91 98452 34567</p>
              <p>kamathsfoodpoint@gmail.com</p>
            </div>
          </div>
          <div style={{ 
            paddingTop: '2rem', 
            borderTop: '1px solid #374151',
            fontSize: '0.95rem',
            opacity: 0.7
          }}>
            © 2025 Kamaths Food Point. Crafted with ❤️ in Mangalore.
          </div>
        </div>
      </footer>
    </div>
  )
}

