// src/App.jsx - Remove './App.css' line
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<div className="text-2xl font-bold">Categories Page</div>} />
          <Route path="/add-categories" element={<div className="text-2xl font-bold">Add Categories</div>} />
          <Route path="/add-order" element={<div className="text-2xl font-bold">Add Order</div>} />
          <Route path="/orders" element={<div className="text-2xl font-bold">Orders Page</div>} />
          <Route path="/sales" element={<div className="text-2xl font-bold">Sales Page</div>} />
        </Routes>
      </main>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-8 animate-pulse">
        🍽️ Kamaths Food Point
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Welcome to your retail billing system
      </p>
    </div>
  )
}

export default App
