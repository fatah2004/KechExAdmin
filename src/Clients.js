import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection,doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { Container,Table, Button } from 'react-bootstrap';

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(clientsData);
    };

    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      setClients(clients.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client: ', error);
    }
  };

  const handleTogglePurchased = async (clientId, currentPurchased) => {
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        purchased: !currentPurchased,
      });
      setClients(clients.map(client => ({
        ...client,
        purchased: client.id === clientId ? !currentPurchased : client.purchased,
      })));
    } catch (error) {
      console.error('Error updating purchased status: ', error);
    }
  };

  const handleToggleCalled = async (clientId, currentCalled) => {
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        called: !currentCalled,
      });
      setClients(clients.map(client => ({
        ...client,
        called: client.id === clientId ? !currentCalled : client.called,
      })));
    } catch (error) {
      console.error('Error updating called status: ', error);
    }
  };

  return (
    <Container>
      <h2>Clients</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Quantity</th>
            <th>Purchased</th>
            <th>Called</th>
            <th>ProductId</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.lastName}</td>
              <td>{client.phone}</td>
              <td>{client.quantity}</td>
              <td>
                <input
                  type="checkbox"
                  checked={client.purchased}
                  onChange={() => handleTogglePurchased(client.id, client.purchased)}
                  />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={client.called}
                  onChange={() => handleToggleCalled(client.id, client.called)}
                  />
              </td>
              <td>{client.productId}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(client.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clients;
