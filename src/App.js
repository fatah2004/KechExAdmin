import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard';
import CreateProductPage from './CreateProductPage';
import Clients from './Clients';
import Products from './Products';
import ProductDetails from './ProductDetails';
import './App.css'; // Add your custom styles here

const App = () => {
  return (
    <Router>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>

          <Navbar.Brand href="/">KechExAdmin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/create-product">Create Product</Nav.Link>
              <Nav.Link href="/clients">Clients</Nav.Link>
              <Nav.Link href="/products">Products</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route  path="/dashboard" element={<Dashboard/>} />
          <Route  path="/create-product" element={<CreateProductPage/>} />
          <Route  path="/clients" element={<Clients/>} />
          <Route  path="/products" element={<Products/>} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          
        </Routes>
    </Router>
  );
};

export default App;
