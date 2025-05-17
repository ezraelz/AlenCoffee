import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Categories from './catagories';
import { useParams } from 'react-router-dom';

interface BlogDetail {
  title: string;
  image_url: string;
  content: string;
  author: string;
  created_at: number;
  category: string;
}

const Blog: React.FC = () => {
  const { category } = useParams(); 
  const [blogItems, setBlogItems] = useState<BlogDetail[]>([]);

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

  const filteredItems = !category
    ? blogItems
    : blogItems.filter(item => item.category === `/blog/${category}`);

  const renderBlogItems = () => {
    if (filteredItems.length === 0) {
      return <p>No blog posts found for this category.</p>;
    }

    return filteredItems
    .filter((b) => b.image_url) // skip if missing image
    .map((b) => {
      const imageUrl = b.image_url.startsWith('http')
        ? b.image_url
        : `http://127.0.0.1:8000${b.image_url}`;

      return (
        <div className="blog-card" key={b.title}>
          <img src={imageUrl} alt={b.title} />
          <div className="detail">
            <h3>{b.title}</h3>
            <p className="author">By {b.author}</p>
            <p className="date">{new Date(b.created_at).toLocaleDateString()}</p>
            <p>{b.content.slice(0, 150)}...</p>
          </div>
        </div>
      );
    });

  };

  return (
    <div className="blog">
      <div className="blog-hero">
        <h1>Blog</h1>
      </div>
      <Categories />
      <div className="blog-container">{renderBlogItems()}</div>
    </div>
  );
};

export default Blog;
