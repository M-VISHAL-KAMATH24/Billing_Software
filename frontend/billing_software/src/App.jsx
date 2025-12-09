import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AddCategories from './pages/AddCategories'
import Categories from './pages/Categories'
import AddOrders from './pages/AddOrders'
import Orders from './pages/Orders'
import HomePageSub from './pages/HomePageSub'

function App() {
  return (
    <Router>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomePageSub/>} />
          <Route path="/add-categories" element={<AddCategories />} />
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/add-order" element={<AddOrders/>} />
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/sales" element={<div className="text-2xl font-bold">Sales</div>} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
