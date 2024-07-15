// Products.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import { db } from './firebase'; // Adjust the import path as per your file structure
import { collection, getDocs, deleteDoc, doc, deleteField } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteProduct = async (productId, imageUrls) => {
    try {
      // Delete images from Firebase Storage
      const storage = getStorage();
      const deletionPromises = imageUrls.map(imageUrl => {
        const imageRef = ref(storage, imageUrl);
        return deleteObject(imageRef);
      });
      await Promise.all(deletionPromises);

      // Delete product document from Firestore
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      // Optionally show a success message
      console.log('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
            <tr key={product.id}>
            <td>{product.productName}</td>
            <td>{product.productPrice}</td>
            <td>{product.description}</td>
            <td>
              <Link to={`/products/${product.id}`}>
                <Button variant="info">Show</Button>
              </Link>
              {/* Implement Edit and Delete buttons with modal/dialogs */}
              <Button variant="warning">Edit</Button>{' '}
              <Button variant="danger" onClick={() => handleDeleteProduct(product.id, product.imageUrls)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
        </Container>
  );
};

export default Products;
