import React from 'react';
import '../styles/CustomerCard.css';

function CustomerCard({ customer }) {
  return (
    <div className="customer-card">
      <img src={customer.photo} alt="Customer" />
      <div className="info">
        <h2>{customer.name}</h2>
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phone}</p>
        <p>Address: {customer.address}</p>
      </div>
    </div>
  );
}

export default CustomerCard;
