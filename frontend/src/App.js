import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link,  Navigate} from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import Shop from './components/Shop';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Navbar from './components/Navbar';
import Cart from './components/cart';
import ProductDetails from './components/ProductDetails';
import AdminDashboard from './components/Dashboard';
import AdminCategories from './components/AdminCategories';
import AdminProducts from './components/AdminProducts';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders';
import OrderHistory from './components/OrderHistory';
import OpticienDashboard from './components/OpticienDashboard';
import AdminOpticianOrders from './components/AdminOpticianOrders';
  
function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/opticien/dashboard" element={<OpticienDashboard />} />
        
        <Route path="/admin/optician-orders" element={<AdminOpticianOrders />} />
        <Route
          path="/home"
          element={
            token && role === 'client' ? <Home /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/admin/products"
          element={
            token && role === 'admin' ? <AdminProducts /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/admin/categories"
          element={
            token && role === 'admin' ? <AdminCategories /> : <Navigate to="/signin" replace />
          }
        />
        <Route
          path="/admin/orders"
          element={
            token && role === 'admin' ? <AdminOrders /> : <Navigate to="/signin" replace />
          }
        />
       


      </Routes>
    </Router>
  );
}

export default App;