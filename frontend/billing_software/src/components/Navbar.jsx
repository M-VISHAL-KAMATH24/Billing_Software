// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingCart, DollarSign, Plus, Filter } from 'lucide-react'

const navItems = [
  { name: 'Categories', path: '/categories', icon: Filter },
  { name: 'Add Categories', path: '/add-categories', icon: Plus },
  { name: 'Add Order', path: '/add-order', icon: Plus },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Sales', path: '/sales', icon: DollarSign }
]

export default function Navbar() {
  const location = useLocation()
  
  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="font-bold text-2xl text-white">🍽️</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Kamaths Food Point
            </span>
          </Link>

          {/* Navigation - FIXED */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ name, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-white/20 text-white shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/20">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </nav>
  )
}
