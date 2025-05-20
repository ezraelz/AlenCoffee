import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

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

  useEffect(() => {
    const fetchAllOrders = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/orders/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
      console.log(response.data);
    };

    fetchAllOrders();
  }, []);

  return (
    <div className='order-list'>
      <h1>All Orders</h1>
      <div className='order-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Session key</th>
              <th>Status</th>
              <th>Total price</th>
            </tr>
          </thead>
          <tbody>
          {orders.length > 0 ? (
              orders.map((order, index)=>(
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.user}</td>
                  <td>{order.session_key}</td>
                  <td>{order.status}</td>
                  <td>{order.total_price}</td>
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
    </div>
  );
};

export default OrderList;
