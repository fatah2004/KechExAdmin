import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Modal, Button, Form, Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import './ProductPage.css';
import 'quill/dist/quill.snow.css';  // Import Quill CSS


const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId); // Adjust the collection name as needed
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const handleSelect = (selectedIndex) => setCurrentIndex(selectedIndex);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const nextThumbnail = () => {
    const nextIndex = currentIndex === product?.imageUrls.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const prevThumbnail = () => {
    const prevIndex = currentIndex === 0 ? product?.imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container className="mt-5">
      <Row>
          <Col md={6}>
            <Carousel activeIndex={currentIndex} onSelect={handleSelect} interval={2000} className="mb-3">
              {product.imageUrls.map((imageUrl, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={imageUrl}
                    alt={`Slide ${index}`}
                    className="d-block w-100 carousel-main-image"
                    fluid
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <div className="position-relative">
              <Button
                variant="light"
                onClick={prevThumbnail}
                disabled={product.imageUrls.length <= 1}
                className="position-absolute start-0 top-50 translate-middle-y"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
              >
                <BsArrowLeft size={24} style={{ color: '#888888' }} />
              </Button>
              <Row className="mt-2 justify-content-center">
                {product.imageUrls.map((imageUrl, index) => {
                  const isCurrent = index === currentIndex;
                  const isPrev = index === currentIndex - 1 || (currentIndex === 0 && index === product.imageUrls.length - 1);
                  const isNext = index === currentIndex + 1 || (currentIndex === product.imageUrls.length - 1 && index === 0);
                  if (isCurrent || isPrev || isNext) {
                    return (
                      <Col key={index} xs={4} sm={3} md={2} className="thumbnail-container">
                        <img 
                          src={imageUrl} 
                          alt={`Thumbnail ${index}`} 
                          className={`img-fluid thumbnail ${isCurrent ? 'main-thumb' : 'not-main'}`} 
                          onClick={() => setCurrentIndex(index)}
                          style={{ cursor: 'pointer' }}
                        />
                      </Col>
                    );
                  }
                  return null;
                })}
              </Row>
              <Button
                variant="light"
                onClick={nextThumbnail}
                disabled={product.imageUrls.length <= 1}
                className="position-absolute end-0 top-50 translate-middle-y"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <BsArrowRight size={24} style={{ color: '#888888' }} />
              </Button>
            </div>
          </Col>
          <Col md={6}>
          <div style={{textAlign:'right'}}>

            <h3>{product.productName}</h3>
            <h3>${product.productPrice}</h3>
          </div>
            <Row className="mt-3">
              <Col md={8} className="mb-3 mb-md-0">
                <Button variant="primary" onClick={handleShow} className="pulse-button">
                  Buy Now
                </Button>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center justify-content-center">
                  <Button variant="outline-secondary" onClick={decrementQuantity}>
                    -
                  </Button>
                  <Form.Control
                    type="text"
                    readOnly
                    value={quantity}
                    className="text-center mx-2"
                    style={{ width: '50px' }}
                  />
                  <Button variant="outline-secondary" onClick={incrementQuantity}>
                    +
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="mt-3" style={{textAlign:'center'}} dangerouslySetInnerHTML={{ __html: product.description }}></div>
          </Col>
        </Row>
      </Container>


      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Buy Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>

            <Form.Group controlId="formLastName">
              <Form.Label>LastName</Form.Label>
              <Form.Control type="text" placeholder="Enter your last name" />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" placeholder="Enter your phone number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetails;
