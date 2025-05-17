import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

interface Blog {
  id: number;
  title: string;
  image: string;
  content: string;
  author_username: string;
  created_at: string;
}

const HomeBlog: React.FC = () => {
  const [blogItems, setBlogItems] = useState<Blog[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get('/blog/list/');
        setBlogItems(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogData();
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % blogItems.length);
      }, 5000); 
      return () => clearInterval(interval); // cleanup
    }, [blogItems.length]);

  const Next = () => {
    setCurrentSlide((prev) => (prev + 1) % blogItems.length)
  }

  const Preview = () => {
    setCurrentSlide((prev) => (prev - 1) % blogItems.length)
  }

    return (
      <div className='home-blog'>
        <div className="container">
          <h2 className="section-title">Latest from the Blog</h2>
          <div className="home-blog-cards">
            {blogItems.length > 0 && (
              <>
                <button type='button' title='prev' onClick={Preview} className='arrow'><FaArrowLeftLong /></button>
                <div className="home-blog-card">
                  <div className="card-content">
                    <h3>{blogItems[currentSlide].title}</h3>
                    <p className="meta">
                      By {blogItems[currentSlide].author_username} · {new Date(blogItems[currentSlide].created_at).toLocaleDateString()}
                    </p>
                    <p>{blogItems[currentSlide].content.slice(0, 600)}...</p>
                  </div>
                  <img src={`http://127.0.0.1:8000/${blogItems[currentSlide].image}`} alt={blogItems[currentSlide].title} />
                </div>
                <button type='button' title='next' onClick={Next} className='arrow'><FaArrowRightLong/></button>
              </>
              
            )}
          </div>
        </div>
      </div>
    );    
};

export default HomeBlog;
