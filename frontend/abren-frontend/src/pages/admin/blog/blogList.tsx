import React, { useEffect, useState } from 'react';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import './BlogList.css';
interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  categories: string[];
  categories_name: string[];
  tags: string[];
  author: number;
  author_username?: string;
}

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  useEffect(() => {
    const fetchAllBlogs = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('/blog/list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      }
    };

    fetchAllBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await axios.delete(`/blog/delete/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('✅ Blog deleted successfully!');
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      toast.error('❌ Failed to delete blog.');
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  return (
    <div className="blog-list">
      <h2>All Blogs</h2>

      {/* Search Input */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Blog Table */}
      <div className="blog-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>Categories</th>
              <th>Tags</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.length > 0 ? (
              currentBlogs.map((blog, index) => (
                <tr key={blog.id}>
                  <td>{indexOfFirstBlog + index + 1}</td>
                  <td>{blog.title}</td>
                  <td>{blog.author_username || `User ${blog.author}`}</td>
                  <td>{(blog.categories_name || []).join(', ')}</td>
                  <td>{(blog.tags || []).join(', ')}</td>
                  <td>{new Date(blog.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => alert(`Navigate to edit blog ${blog.id}`)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(blog.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No blogs found.
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

export default BlogList;
