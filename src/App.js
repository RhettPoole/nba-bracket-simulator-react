import React, { useState } from 'react';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  function addCustomer(newCustomer) {
    setCustomers([...customers, newCustomer]);
    setSuccessMsg('Successfully add ${newCustomer.name}!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Customer Info Viewer</h1>
      {successMsg && <div className='success-message'>{successMsg}</div>}
      <CustomerForm onAdd={addCustomer} />
      <CustomerList customers={customers} />
    </div>
  );
}

export default App;
