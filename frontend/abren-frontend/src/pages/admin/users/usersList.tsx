import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';

interface UserEntry {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    role: string;
    email: string;
  };
  shipping_address: {
    address1: string;
  }; 
  total_spent: number[];
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserEntry[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('/users/users/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
      console.log(response.data);
    };

    fetchAllUsers();
  }, []);

  return (
    <div className='users-list'>
      <h1>All Users</h1>
      <div className='users-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Shipping Address</th>
              <th>Total Spent ($)</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((entry, index) => {
                const { user, shipping_address, total_spent } = entry;
                const totalSpentAmount = total_spent.reduce((acc, val) => acc + val, 0); // adjust if total_spent contains objects
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{shipping_address.address1}</td>
                    <td>${totalSpentAmount.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
