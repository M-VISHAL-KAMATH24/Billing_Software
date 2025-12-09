// src/pages/Sales.jsx - COMPLETE DASHBOARD (LIGHT THEME)
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
        background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: '#334155',
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

  const maxAmount = salesData.length
    ? Math.max(...salesData.map(d => d.amount))
    : 1

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
      color: '#0f172a',
      padding: '2rem 0'
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
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          💰 Sales Dashboard
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#475569',
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
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(34,197,94,0.25)'
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
          {[ 
            { label: 'Today', value: todaySales, color: '#22c55e' },
            { label: 'This Month', value: monthlySales, color: '#2563eb' },
            { label: 'Lifetime', value: totalSales, color: '#f59e0b' }
          ].map((card, i) => (
            <div key={i} style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid #e5e7eb',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '2.8rem', color: card.color, marginBottom: '1rem' }}>
                ₹
              </div>
              <div style={{
                fontSize: 'clamp(2.2rem, 7vw, 3.5rem)',
                fontWeight: '900',
                marginBottom: '0.5rem'
              }}>
                ₹{card.value.toLocaleString()}
              </div>
              <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
                {card.label} Revenue
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>

          {/* Sales Chart */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '2rem'
            }}>
              💹 Daily Sales Trend (Last 10 Days)
            </h3>

            <div style={{
              height: '350px',
              display: 'grid',
              gridTemplateColumns: `repeat(${salesData.length}, 1fr)`,
              gap: '10px',
              alignItems: 'flex-end'
            }}>
              {salesData.map((sale) => {
                const heightPercent = (sale.amount / maxAmount) * 100
                return (
                  <div key={sale.id} style={{
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(to top, #2563eb, #60a5fa)',
                    borderRadius: '6px'
                  }} />
                )
              })}
            </div>
          </div>

          {/* Recent Sales */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '1.5rem'
            }}>
              🕒 Recent Transactions
            </h3>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {salesData.slice(0, 8).map((sale, index) => (
                <div key={sale.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: index < 7 ? '1px solid #e5e7eb' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>
                      Order #{sale.id}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: '#16a34a'
                  }}>
                    ₹{sale.amount.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Growth */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '2rem'
          }}>
            📈 Weekly Growth (This Month)
          </h3>

          <div style={{ height: '260px', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            {[1200, 1800, 1450, 2200, 1950, 2800, 2450].map((value, index) => {
              const heightPercent = (value / 2800) * 80
              return (
                <div key={index} style={{ flex: 1 }}>
                  <div style={{
                    height: `${heightPercent}%`,
                    background: index % 2 === 0
                      ? 'linear-gradient(to top, #22c55e, #4ade80)'
                      : 'linear-gradient(to top, #2563eb, #60a5fa)',
                    borderRadius: '8px'
                  }} />
                  <div style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem',
                    color: '#64748b'
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
  )
}
