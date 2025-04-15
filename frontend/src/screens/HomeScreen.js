import React from 'react';
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

// Reducer function to handle state changes based on dispatched actions
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

// HomeScreen component
export default function HomeScreen() {

  // Using useReducer without the logger
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {

    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Use the backend API URL from the .env file
        const result = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();

  }, []); // Empty dependency array so it runs once on component mount

  return (
    <div>
      <Helmet>
        <title>Anastacia</title>
      </Helmet>
      <h1>Featured Products</h1>
      <br />
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {product.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
