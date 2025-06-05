import React from 'react';
import './shoppingform.css';

interface ShippingFormProps {
  formData: {
    full_name: string;
    email: string;
    phone_number: string;
    address1: string;
    address2: string;
    city: string;
    street?: string;
    state?: string;
    country: string;
    zipcode: string;
  };
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ formData, loading, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb4">
        <input
          title='full_name'
          type="text"
          name="full_name"
          placeholder=" "
          value={formData.full_name || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="full_name" className='label'>Full Name</label>
      </div>
      <div className="mb4">
        <input
          title='email'
          type="email"
          name="email"
          placeholder=" "
          value={formData.email || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="email" className='label'>Email</label>
      </div>
      <div className="mb4">
        <input
          title='phone_number'
          type="tel"
          name="phone_number"
          placeholder=" "
          value={formData.phone_number || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="phone_number">Phone</label>
      </div>
      <div className="mb4">
        <input
          title='address1'
          type="text"
          name="address1"
          placeholder=" "
          value={formData.address1 || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="address1" className='label'>Address 1</label>
      </div>
      
      <div className="mb4">
        <input
          title='address2'
          type="text"
          name="address2"
          placeholder=" "
          value={formData.address2 || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="address2" className='label'>Address 2</label>
      </div>
      <div className="mb4">
        <input
          title='city'
          type="text"
          name="city"
          placeholder=" "
          value={formData.city || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="city" className='label'>City</label>
      </div>
      <div className="mb4">
        <input
          title='street'
          type="text"
          name="street"
          placeholder=" "
          value={formData.street || ''}
          onChange={onChange}
        />
        <label htmlFor="street">Street (optional)</label>
      </div>
      <div className="mb4">
        <input
          title='state'
          type="text"
          name="state"
          placeholder=" "
          value={formData.state || ''}
          onChange={onChange}
        />
        <label htmlFor="state">State (optional)</label>
      </div>
      <div className="mb4">
        <input
          title='country'
          type="text"
          name="country"
          placeholder=" "
          value={formData.country || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="country">Country</label>
      </div>
      <div className="mb4">
        <input
          title='zipcode'
          type="text"
          name="zipcode"
          placeholder=" "
          value={formData.zipcode || ''}
          onChange={onChange}
          required
        />
        <label htmlFor="zipcode">Zip Code</label>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Place Shipping Address'}
      </button>
    </form>
  );
};

export default ShippingForm;
