import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Catagories from './catagories';

interface Detail {
  title: string;
  image_url: string;
  content: string;
  author: string;
  created_at: number;
}

const Blog: React.FC = () => {
  const [blogItems, setBlogItems] = useState<Detail[]>([]);
  const [activeBlog, setActiveBlog] = useState<string>('/blog');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        console.log(response.data);
        setBlogItems(response.data);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      }
    };

    fetchBlogData();
  }, []);

  const AllCategories: React.FC = () => {
    return (
      <>
        {blogItems.length > 0 ? blogItems.map((b, i) => {
          const imageUrl = b.image_url.startsWith('http') ? b.image_url : `http://127.0.0.1:8000${b.image_url}`;
          return (
            <div className="blog-card" key={i}>
              <img src={imageUrl} alt={b.title} />
              <div className="detail">
                <h3>{b.title}</h3>
                <p className="author">By {b.author}</p>
                <p className="date">{new Date(b.created_at).toLocaleDateString()}</p>
                <p>{b.content.slice(0, 150)}...</p>
              </div>
            </div>
          );
        }) : (
          <p>No blog posts found.</p>
        )}
      </>
    );
  };

  const renderActiveBlog = () => {
    switch (activeBlog) {
      case '/blog':
        return <AllCategories />;
      // You can add more cases like /blog/tech etc. later
      default:
        return <AllCategories />;
    }
  };

  return (
    <div className='blog'>
      <div className="blog-hero">
        <h1>Blog</h1>
      </div>
      <Catagories setActiveBlog={setActiveBlog} />
      <div className="blog-container">
        {renderActiveBlog()}
      </div>
    </div>
  );
};

export default Blog;
