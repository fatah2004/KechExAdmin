import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { db } from './firebase'; // Adjust the import path as per your file structure
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateProductPage = () => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false); // New state for success message
  const quillRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const selectedImages = files.slice(0, 5); // Limit to 5 images
    setProductImages(selectedImages);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(productImages.map(uploadImage));

      // Save product details to Firestore
      await setDoc(doc(db, "products", productName), {
        productName,
        productPrice,
        description,
        imageUrls,
        createdAt: Timestamp.fromDate(new Date()), // Set timestamp for createdAt
      });

      // Reset form fields after submission
      setProductName('');
      setProductPrice('');
      setDescription('');
      setProductImages([]);
      setUploadSuccess(true); // Set success message state
    } catch (error) {
      console.error('Error uploading product:', error);
      setUploadError('Failed to save product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async (imageFile) => {
    const storage = getStorage();
    const storageRef = ref(storage, `product_images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        [{ 'align': [] }, { 'color': [] }],
        ['clean']
      ]
    }
  };

  const formats = [
    'header', 'font', 'size', 'bold', 'italic',
    'underline', 'strike', 'blockquote', 'list', 'bullet',
    'link', 'image', 'video', 'align', 'color'
  ];

  return (
    <Container className="mt-4">
      <h2>Create Product Page</h2>
      {uploadError && <Alert variant="danger">{uploadError}</Alert>}
      {uploadSuccess && <Alert variant="success">Product successfully saved!</Alert>} {/* Success message */}
      <Form onSubmit={handleFormSubmit} className="mt-4">
        <Form.Group controlId="productName">
          <Form.Label>Product Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="productPrice">
          <Form.Label>Product Price:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </Form.Group>
        <ReactQuill
          ref={quillRef}
          value={description}
          onChange={setDescription}
          modules={modules}
          formats={formats}
        />
        <Form.Group controlId="productImages">
          <Form.Label>Product Images:</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            required
          />
          <Form.Text className="text-muted">
            Select up to 5 images (hold Ctrl/Cmd to select multiple)
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Product'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateProductPage;
