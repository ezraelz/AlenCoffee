import React, { useEffect, useRef, useState } from 'react';
import axios from '../../utils/axios';
import Categories from './catagories';
import {  useParams } from 'react-router-dom';
import './blog.css';

interface BlogDetail {
  title: string;
  image: string;
  content: string;
  author: string;
  author_username: string;
  created_at: number;
  categories: string[];
}

const Blog: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [blogItems, setBlogItems] = useState<BlogDetail[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // now it's just one selected category
  const { name } = useParams(); // if you want to filter by URL like /blog/category/:name
  const lastScrollY = useRef<number>(0);

  const handleScrollChange = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScrollChange);
      return () => window.removeEventListener('scroll', handleScrollChange);
    }, []);


  useEffect(() => {
    if (name) setSelectedCategory(name); // optional: load filter from URL param
  }, [name]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });
        setBlogItems(response.data);
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      }
    };

    fetchBlogData();
  }, []);

  const filteredItems =
    selectedCategory === ''
      ? blogItems
      : blogItems.filter((item) =>
          item.categories.includes(selectedCategory)
        );

  const renderBlogItems = () => {
    if (filteredItems.length === 0) {
      return <p>No blog posts found for this category.</p>;
    }

    return filteredItems
      .filter((b) => b.image)
      .map((b) => {
        const imageUrl = b.image.startsWith('http')
          ? b.image
          : `http://127.0.0.1:8000${b.image}`;

        return (
          <div className="blog-card" key={b.title}>
            <img src={imageUrl} alt={b.title} />
            <div className="detail">
              <h3>{b.title}</h3>
              <p className="author">By {b.author_username}</p>
              <p className="date">
                {new Date(b.created_at).toLocaleDateString()}
              </p>
              <p className='content'>{b.content.slice(0, 150)}...</p>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="blog">
      <div className={isScrolled ? "blog-hero scroll" : 'blog-hero'}>
        <h1>Blog</h1>
        <Categories setCategory={setSelectedCategory} /> {/* Pass setter to child */}
      </div>
      <div className="blog-container">{renderBlogItems()}</div>
    </div>
  );
};

export default Blog;
