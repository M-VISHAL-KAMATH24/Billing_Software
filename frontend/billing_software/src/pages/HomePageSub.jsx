import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function HomePageSub() {
  const [floatingShapes, setFloatingShapes] = useState([])
  const rafRef = useRef(null)

  // helper to create initial shapes
  const createShapes = () => {
    const arr = []
    for (let i = 0; i < 12; i++) {
      const size = 20 + Math.random() * 40
      arr.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: ['#f97316', '#10b981', '#3b82f6', '#ef4444', '#f59e0b'][Math.floor(Math.random() * 5)]
      })
    }
    return arr
  }

  useEffect(() => {
    // initialize shapes once
    setFloatingShapes(createShapes())

    // animation loop
    const animate = () => {
      setFloatingShapes(prev => {
        // defensive: if prev empty, nothing to do
        if (!prev || prev.length === 0) return prev

        const w = window.innerWidth
        const h = window.innerHeight

        return prev.map(shape => {
          // compute next position
          let nextX = shape.x + shape.speedX
          let nextY = shape.y + shape.speedY
          let speedX = shape.speedX
          let speedY = shape.speedY

          // bounce left/right (consider shape.size so it's not half-offscreen)
          if (nextX < -shape.size / 2) {
            nextX = -shape.size / 2
            speedX = -speedX
          } else if (nextX > w - shape.size / 2) {
            nextX = w - shape.size / 2
            speedX = -speedX
          }

          // bounce top/bottom
          if (nextY < -shape.size / 2) {
            nextY = -shape.size / 2
            speedY = -speedY
          } else if (nextY > h - shape.size / 2) {
            nextY = h - shape.size / 2
            speedY = -speedY
          }

          return {
            ...shape,
            x: nextX,
            y: nextY,
            rotation: shape.rotation + shape.rotSpeed,
            speedX,
            speedY
          }
        })
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // keep shapes inside viewport when resizing
    const onResize = () => {
      setFloatingShapes(prev => {
        const w = window.innerWidth
        const h = window.innerHeight
        return prev.map(s => ({
          ...s,
          x: Math.min(Math.max(s.x, -s.size / 2), w - s.size / 2),
          y: Math.min(Math.max(s.y, -s.size / 2), h - s.size / 2)
        }))
      })
    }
    window.addEventListener('resize', onResize)

    // cleanup on unmount
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Shapes */}
      {floatingShapes.map(shape => (
        <div key={shape.id} style={{
          position: 'fixed',
          left: shape.x,
          top: shape.y,
          width: shape.size,
          height: shape.size,
          // 8-digit hex (alpha) appended — shape.color already contains '#rrggbb'
          background: `radial-gradient(circle, ${shape.color}22, transparent)`,
          borderRadius: '50%',
          transform: `rotate(${shape.rotation}deg)`,
          zIndex: 1,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Owner Section */}
      <section style={{ padding: '6rem 2rem 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Owner Image */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '400px',
              height: '400px',
              margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 40px 100px rgba(249,115,22,0.4)',
              position: 'relative'
            }}>
              <div style={{
                width: '320px',
                height: '320px',
                background: `url('https://images.unsplash.com/photo-1615484473779-b15846e08885?w=400') center/cover`,
                borderRadius: '50%',
                border: '8px solid white',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                right: '-1rem',
                width: '80px',
                height: '80px',
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(16,185,129,0.4)'
              }}>👨‍🍳</div>
            </div>
          </div>

          {/* Owner Info */}
          <div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '900',
              color: '#1f2937',
              lineHeight: '1.1',
              marginBottom: '2rem'
            }}>
              Meet Our Founders
            </h1>
            <div style={{
              fontSize: '1.5rem',
              color: '#374151',
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              <strong style={{ color: '#1f2937', fontSize: '2rem' }}>Mr. Manjunath Kamath</strong>
              <p style={{ margin: '1rem 0', fontSize: '1.2rem' }}>
                With 25+ years of culinary excellence, Manjunath brings authentic
                Mangalorean flavors to every plate. Passionate about fresh ingredients
                and traditional recipes passed down through generations.
              </p>
            </div>
            <div style={{
              fontSize: '1.5rem',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#1f2937', fontSize: '1.8rem' }}>Divya Kamath</strong>
              <p style={{ margin: '1rem 0', fontSize: '1.2rem' }}>
                The heart of our kitchen, Divya crafts every dish with love and
                precision. Known for her signature coconut curries and perfect dosas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '6rem 2rem 4rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6rem',
            alignItems: 'center',
            direction: 'rtl'
          }}>
            {/* Shop Image */}
            <div style={{ textAlign: 'center', order: 2 }}>
              <div style={{
                width: '450px',
                height: '350px',
                margin: '0 auto',
                background: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500') center/cover`,
                borderRadius: '30px',
                position: 'relative',
                boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 2rem',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>📍 Kamaths Food Point</div>
                </div>
              </div>
            </div>

            {/* Shop Info */}
            <div style={{ order: 1, direction: 'ltr' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Our Legacy
              </h2>
              <p style={{
                fontSize: '1.4rem',
                color: '#4b5563',
                lineHeight: '1.7',
                marginBottom: '2rem'
              }}>
                Since 1995, Kamaths Food Point has been serving authentic
                <strong>Mangalorean cuisine</strong> with a modern twist.
                From crispy <strong>neer dosas</strong> to fiery <strong>chicken ghee roast</strong>,
                every dish tells a story of tradition and passion.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
                  padding: '2rem',
                  borderRadius: '24px',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(249,115,22,0.2)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937' }}>
                    Authentic Flavors
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    100% Traditional Recipes
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  padding: '2rem',
                  borderRadius: '24px',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(16,185,129,0.2)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1f2937' }}>
                    Family Run
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    25+ Years Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            color: '#1f2937',
            marginBottom: '1.5rem'
          }}>
            Ready to Order?
          </h2>
          <p style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            Experience the taste of Mangalore at your table
          </p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/add-orders" style={{
              padding: '1.25rem 3rem',
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.3rem',
              fontWeight: '700',
              boxShadow: '0 20px 40px rgba(249,115,22,0.4)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                const t = e.currentTarget
                t.style.transform = 'translateY(-4px)'
                t.style.boxShadow = '0 25px 50px rgba(249,115,22,0.5)'
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget
                t.style.transform = 'translateY(0)'
                t.style.boxShadow = '0 20px 40px rgba(249,115,22,0.4)'
              }}
            >
              🍽️ Place Order
            </Link>
            <Link to="/orders" style={{
              padding: '1.25rem 3rem',
              background: 'transparent',
              color: '#1f2937',
              textDecoration: 'none',
              borderRadius: '50px',
              fontSize: '1.3rem',
              fontWeight: '700',
              border: '3px solid #f97316',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => {
                const t = e.currentTarget
                t.style.background = '#f97316'
                t.style.color = 'white'
                t.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget
                t.style.background = 'transparent'
                t.style.color = '#1f2937'
                t.style.transform = 'translateY(0)'
              }}
            >
              📋 View Orders
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'white',
        padding: '4rem 2rem 2rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #f97316, #ef4444)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                🍽️ Kamaths Food Point
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: '1.7' }}>
                Authentic Mangalorean cuisine served with love since 1995.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#f3f4f6' }}>
                📍 Location
              </h4>
              <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                Near City Center, Mangalore
              </p>
              <p style={{ color: '#f97316', fontWeight: '600' }}>
                Open 7AM - 11PM Daily
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#f3f4f6' }}>
                📞 Contact
              </h4>
              <p style={{ color: '#f97316', fontWeight: '700', fontSize: '1.2rem' }}>
                +91 98452 34567
              </p>
              <p style={{ color: '#d1d5db' }}>
                kamathsfoodpoint@gmail.com
              </p>
            </div>
          </div>
          <div style={{
            textAlign: 'center',
            paddingTop: '2rem',
            borderTop: '1px solid #374151',
            color: '#9ca3af'
          }}>
            © 2025 Kamaths Food Point. Made with ❤️ in Mangalore.
          </div>
        </div>
      </footer>
    </div>
  )
}
