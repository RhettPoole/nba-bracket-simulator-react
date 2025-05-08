import React from 'react';
import './styles/CustomerList.css';
import CustomerCard from './CustomerCard';

function CustomerList({ customers }) {
  return (
    <div className="customer-list">
      {customers.map((customer, index) => (
        <CustomerCard key={index} customer={customer} />
      ))}
    </div>
  );
}

export default CustomerList;
