import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Order {
    id: number;
    user: string;
    session_key: string;
    created_at: string;
    status: string;
    total_price: number;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/adminPanel/orders/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
      console.log(response.data);
    };

    fetchAllOrders();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/orders/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Order deleted successfully!');
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      toast.error('❌ Failed to delete order.');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrder = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);


  return (
    <div className='order-list'>
      <h2>All Orders</h2>
      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Session key</th>
              <th>Status</th>
              <th>Total price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentOrder.length > 0 ? (
              currentOrder.map((order, index)=>(
                <tr key={order.id}>
                  <td>{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                  <td>{order.user}</td>
                  <td>{order.session_key}</td>
                  <td>{order.status}</td>
                  <td>{order.total_price}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/orders/detail/${order.id}`)}
                      >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
              <td colSpan={6} className="text-center">
                No Orders found.
              </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            onClick={() => setCurrentPage(page + 1)}
            className={currentPage === page + 1 ? 'active' : ''}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
