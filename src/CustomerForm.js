import React, { useState } from 'react';
import './styles/CustomerForm.css';

function CustomerForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: ''
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(formData); // send data to parent (App)
    setFormData({ name: '', email: '', phone: '', address: '', photo: '' }); // reset form
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
      <input name="photo" placeholder="Photo URL" value={formData.photo} onChange={handleChange} required />
      <button type="submit">Add Customer</button>
    </form>
  );
}

export default CustomerForm;
