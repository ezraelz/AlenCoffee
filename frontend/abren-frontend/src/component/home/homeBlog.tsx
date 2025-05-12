import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

interface Blog {
  id: number;
  title: string;
  image_url: string;
  content: string;
  author_username: string;
  created_at: string;
}

const HomeBlog: React.FC = () => {
  const [blogItems, setBlogItems] = useState<Blog[]>([]);
  const maxBlogs = 4;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/');
        setBlogItems(response.data.slice(0, maxBlogs));
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogData();
  }, []);

  return (
    <div className='home-blog'>
      <div className="container">
        <h2 className="section-title">Latest from the Blog</h2>
        <div className="home-blog-cards">
          {blogItems.map((blog) => {
            const imageUrl = blog.image_url.startsWith('http')
              ? blog.image_url
              : `http://127.0.0.1:8000${blog.image_url}`;
            return (
              <div className="home-blog-card" key={blog.id}>
                <img src={imageUrl} alt={blog.title} />
                <div className="card-content">
                  <h3>{blog.title}</h3>
                  <p className="meta">
                    By {blog.author_username} · {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <p>{blog.content.slice(0, 100)}...</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeBlog;
