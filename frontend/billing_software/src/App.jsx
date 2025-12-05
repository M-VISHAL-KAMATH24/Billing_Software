import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddCategories from './pages/AddCategories'

function App() {
  return (
    <Router>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<div className="text-2xl font-bold text-center mt-20">Home Page</div>} />
          <Route path="/add-categories" element={<AddCategories />} />
          <Route path="/categories" element={<div className="text-2xl font-bold">Categories</div>} />
          <Route path="/add-order" element={<div className="text-2xl font-bold">Add Order</div>} />
          <Route path="/orders" element={<div className="text-2xl font-bold">Orders</div>} />
          <Route path="/sales" element={<div className="text-2xl font-bold">Sales</div>} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
