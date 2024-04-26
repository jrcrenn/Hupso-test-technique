import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Reservations from './pages/Reservations'
import Book from './pages/Book'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/reservations" element={ <Reservations /> } />
        <Route path="/book/:id" element={ <Book /> } />
      </Routes>
    </Router>
)
