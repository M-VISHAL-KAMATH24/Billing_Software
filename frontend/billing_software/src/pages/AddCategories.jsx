// src/pages/AddCategories.jsx
import { useState } from 'react'
import axios from 'axios'

const categories = ['chats', 'juice', 'burgers', 'breakfast', 'special items']

export default function AddCategories() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: null
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price || !formData.image) {
      setMessage('Please fill all fields')
      return
    }

    setLoading(true)
    setMessage('')

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('image', formData.image)

    try {
      const response = await axios.post(
        'http://localhost:8080/api/food-items',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      
      setMessage(`✅ ${response.data.name} added successfully! ID: ${response.data.id}`)
      setFormData({ name: '', category: '', price: '', image: null })
      
    } catch (error) {
      setMessage('❌ Error: ' + (error.response?.data || 'Server not running'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 1rem' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: '3rem',
        color: '#1f2937'
      }}>
        Add New Food Item
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1)',
        padding: '2rem'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Chicken Biryani"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '1.125rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '1.125rem',
                backgroundColor: 'white'
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="299"
              min="0"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #d1d5db',
                borderRadius: '12px',
                fontSize: '1.125rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem' }}>
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                backgroundColor: '#f9fafb'
              }}
              required
            />
            {formData.image && (
              <p style={{ marginTop: '0.5rem', color: '#059669', fontWeight: '500' }}>
                ✅ {formData.image.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: loading ? '#9ca3af' : '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Food Item'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '500',
            border: '2px solid',
            backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : '#991b1b',
            borderColor: message.includes('✅') ? '#bbf7d0' : '#fecaca'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
