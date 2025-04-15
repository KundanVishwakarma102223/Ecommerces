import React, { useContext, useState, useEffect } from 'react';
import {
  BrowserRouter as Router, // Only use Router once
  Route,
  Routes,
} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Store } from './Store';
import { Button, Container, Navbar, Nav, Badge, NavDropdown } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

// Importing your screens and components
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutUs from './screens/AboutUsScreen';
import HowToScreen from './screens/HowToScreen';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import DashboardScreen from './screens/DashboardScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import SearchBox from './components/SearchBox';
import { getError } from './utils';

// App component
export default function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <Router>
      <div className={sidebarIsOpen ? 'd-flex flex-column site-container active-cont' : 'd-flex flex-column site-container'}>
        <ToastContainer position="bottom-center" limit={1} />
        
        {/* Header with navigation */}
        <header>
          <Navbar className="navbar-custom" variant="dark" expand="lg">
            <Container>
              <Button variant="light" className="me-3" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand className="brand-name">Anastacia</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="ml-auto">
                  <LinkContainer to="/about" className="nav-link">
                    <Navbar.Brand>About Us</Navbar.Brand>
                  </LinkContainer>
                  <LinkContainer to="/howto" className="nav-link">
                    <Navbar.Brand>How To..</Navbar.Brand>
                  </LinkContainer>
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>

                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item" to="#signout" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        {/* Sidebar with product categories */}
        <div className={sidebarIsOpen ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column' : 'side-navbar d-flex justify-content-between flex-wrap flex-column'}>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer to={{ pathname: '/search', search: `?category=${category}` }} onClick={() => setSidebarIsOpen(false)}>
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {/* Main Section with Routes */}
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/howto" element={<HowToScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />

              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>

        {/* Footer */}
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </Router>
  );
}
