import { useState } from 'react'
import { Router, Route } from 'wouter'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import PropertyDetail from './pages/PropertyDetail'
import Reports from './pages/Reports'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Route path="/" component={Dashboard} />
        <Route path="/search" component={Search} />
        <Route path="/property/:id" component={PropertyDetail} />
        <Route path="/reports" component={Reports} />
      </div>
    </Router>
  )
}

export default App
