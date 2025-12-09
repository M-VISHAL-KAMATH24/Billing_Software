// src/pages/Sales.jsx - COMPLETE DASHBOARD
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Sales() {
  const [todaySales, setTodaySales] = useState(0)
  const [totalSales, setTotalSales] = useState(0)
  const [monthlySales, setMonthlySales] = useState(0)
  const [salesData, setSalesData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [])

  // Update the fetchSalesData function in Sales.jsx:
const fetchSalesData = async () => {
  try {
    setLoading(true)
    const [todayRes, totalRes, monthlyRes, recentRes] = await Promise.all([
      axios.get('http://localhost:8080/api/sales/today'),
      axios.get('http://localhost:8080/api/sales/total'),
      axios.get('http://localhost:8080/api/sales/monthly'),
      axios.get('http://localhost:8080/api/sales/recent')
    ])
    
    setTodaySales(todayRes.data || 0)
    setTotalSales(totalRes.data || 0)
    setMonthlySales(monthlyRes.data || 0)
    setSalesData(recentRes.data || [])
  } catch (error) {
    console.error('Sales fetch error:', error)
  } finally {
    setLoading(false)
  }
}


  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '2rem', 
          textAlign: 'center',
          padding: '4rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📊</div>
          Loading Sales Dashboard...
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1e293b 100%)',
      color: 'white',
      padding: '2rem 0',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '0 2rem 3rem', 
        maxWidth: '1600px', 
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
          fontWeight: '900', 
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          💰 Sales Dashboard
        </h1>
        <p style={{ 
          fontSize: '1.4rem', 
          opacity: 0.9, 
          maxWidth: '600px', 
          margin: '0 auto' 
        }}>
          Real-time analytics for Kamaths Food Point
        </p>
        <button 
          onClick={fetchSalesData}
          style={{
            marginTop: '2rem',
            padding: '1rem 2.5rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(16,185,129,0.3)'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2rem', 
          marginBottom: '3rem' 
        }}>
          {/* Today Sales */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}>📅 Today</div>
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>
              ₹{todaySales.toLocaleString()}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Daily Revenue</div>
          </div>

          {/* Monthly Sales */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>📊 This Month</div>
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>
              ₹{monthlySales.toLocaleString()}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '1.1rem' }}>Monthly Revenue</div>
          </div>

          {/* Total Sales */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', color: '#f59e0b', marginBottom: '1rem' }}>💎 Lifetime</div>
            <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>
              ₹{totalSales.toLocaleString()}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '1.1rem' }}>All Time Revenue</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Sales Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>
              💹 Daily Sales Trend (Last 10 Days)
            </h3>
            <div style={{ 
              height: '400px', 
              position: 'relative',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* Chart Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${salesData.length}, 1fr)`,
                height: '100%',
                gap: '2px',
                padding: '2rem 1.5rem'
              }}>
                {salesData.map((sale, index) => {
                  const heightPercent = Math.min((sale.amount / Math.max(...salesData.map(d => d.amount))) * 100, 100)
                  return (
                    <div key={sale.id} style={{ position: 'relative' }}>
                      <div style={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        background: `linear-gradient(to top, #10b981, #059669)`,
                        borderRadius: '4px 4px 0 0',
                        position: 'relative',
                        bottom: 0,
                        transition: 'height 0.3s ease'
                      }} />
                      {index % 2 === 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '-2rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.8rem',
                          color: '#9ca3af',
                          whiteSpace: 'nowrap'
                        }}>
                          Day {10-index}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* Chart Labels */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '2rem',
                right: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#9ca3af'
              }}>
                <span>₹0</span>
                <span>₹{Math.max(...salesData.map(d => d.amount)).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Recent Sales */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white' }}>
              🕒 Recent Transactions
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {salesData.slice(0, 8).map((sale, index) => (
                <div key={sale.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 0',
                  borderBottom: index < 7 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  fontSize: '1rem'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: 'white', marginBottom: '0.25rem' }}>
                      Order #{sale.id}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.3rem', 
                    fontWeight: '800', 
                    color: '#10b981' 
                  }}>
                    ₹{sale.amount.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '3rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', color: 'white' }}>
            📈 Weekly Growth (This Month)
          </h3>
          <div style={{ height: '300px', position: 'relative' }}>
            {/* Mock growth bars */}
            <div style={{
              display: 'flex',
              height: '100%',
              gap: '1rem',
              alignItems: 'flex-end',
              padding: '2rem 1rem'
            }}>
              {[1200, 1800, 1450, 2200, 1950, 2800, 2450].map((value, index) => {
                const heightPercent = (value / 2800) * 80
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse' }}>
                    <div style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      background: index % 2 === 0 ? 
                        'linear-gradient(to top, #10b981, #059669)' : 
                        'linear-gradient(to top, #3b82f6, #1d4ed8)',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '0.5rem'
                    }} />
                    <div style={{ 
                      textAlign: 'center', 
                      fontSize: '0.8rem', 
                      color: '#9ca3af',
                      fontWeight: '600'
                    }}>
                      Week {index + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
