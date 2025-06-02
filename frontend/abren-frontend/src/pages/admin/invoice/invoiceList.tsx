import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import './invoice.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaPen } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';

interface Invoice {
  id: number;
  order: number;
  created_at: string;
  status: 'pending' | 'paid' | 'cancelled' | 'failed';
  pdf_file?: string; // Optional property for the PDF file URL
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/orders/invoices/', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setInvoices(response.data);
      console.log('Invoices loaded:', response.data);
    } catch (err) {
      console.error('Error loading invoices:', err);
      toast.error('❌ Failed to load invoices');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(`/orders/invoice/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Invoice deleted successfully!');
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    } catch {
      toast.error('❌ Failed to delete product.');
    }
  };

  return (
    <div className="invoices-container">
      <h2>All Invoices</h2>
  
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.order}</td>
                <td>{new Date(invoice.created_at).toLocaleDateString()}</td>
                <td>{invoice.status}</td>
                <td className="action-buttons">
                  <button onClick={() => navigate(`/admin/invoices/detail/${invoice.id}`)}><FaEye/></button>
                  <button onClick={() => alert(`Editing ${invoice.id}`)}><FaPen/></button>
                  <button onClick={() => handleDelete(Number(invoice.id))}><FaTrashCan/></button>
                  {invoice.pdf_file && (
                    <a
                      href={invoice.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="download-link"
                    >
                      <button>Download</button>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {invoices.length === 0 && !loading && (
        <p>No invoices found.</p>
      )}
    </div>
  );
  
};

export default Invoices;
