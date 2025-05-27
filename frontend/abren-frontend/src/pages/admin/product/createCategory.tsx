import React, {  useRef, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './createCategory.css';


const CreateCategory: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '',

  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked, files } = e.target;
    if (type === 'file' && files?.[0]) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('access_token');
    const form = new FormData();

    form.append('name', formData.name);

    try {
      await axios.post('/products/create-category/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Product Category created successfully!');
      setFormData({
        name: '',
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      toast.error('❌ Failed to create product category. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const Onclose = () => {
    setIsOpen(false);
  }

  const handleClose = () => {
    Onclose();
  }

  
  return (
    <>
        <form onSubmit={handleSubmit} className="category-form">
        <h2>Create Blog Category</h2>

        <div className="form-group">
            <input
            type="text"
            name="name"
            placeholder='name'
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
            />
        </div>

        <button type="submit" disabled={loading} className="category-form-button">
            {loading ? 'Submitting...' : 'Create Blog Category'}
        </button>
        </form>
    </>
    
  );
};

export default CreateCategory;
