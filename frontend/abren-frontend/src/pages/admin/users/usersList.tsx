import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface ShippingAddress {
  id?: number;
  address1?: string;
  street?: string;
  city?: string;
  zip_code?: string;
  // Add more fields if needed
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
  email: string;
}

interface UserEntry {
  id: string;
  user: User;
  shipping_address: ShippingAddress[];
  total_spent: number[];
}


const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const navigate = useNavigate()

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

  const filteredUsers = users.filter((user) =>
    user.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Product deleted successfully!');
      setUsers(users.filter((user) => user.id !== id.toString()));
    } catch (error) {
      toast.error('❌ Failed to delete product.');
    }
  };

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
              <th>Shipping Address Count</th>
              <th>Total Spent ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((entry, index) => {
                const { user, shipping_address, total_spent } = entry;
                const totalSpentAmount = total_spent; // adjust if total_spent contains objects
                return (
                  <tr key={user.id}>
                    <td>{indexOfFirstUser + index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {shipping_address.length > 0 ? (
                        shipping_address.map((addr, i) => (
                          <div key={i}>{addr.address1 || 'No address info'}, {addr.street || 'No street info'}</div>
                        ))
                      ) : (
                        <span>No address</span>
                      )}
                    </td>

                    <td>${totalSpentAmount}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => navigate(`/admin/users/detail/${user.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(Number(user.id))}
                      >
                        🗑️
                      </button>
                    </td>
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

export default UsersList;
