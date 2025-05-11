import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  setActiveBlog: (path: string) => void;
}

const Catagories: React.FC<Props> = ({ setActiveBlog }) => {
  const categories = [
    { name: 'All Categories', link: '/blog' },
    { name: 'News', link: '/blog/news' },
    { name: 'Coffee Production', link: '/blog/coffee' },
    { name: 'Random', link: '/blog/random' },
  ];

  return (
    <div className='blog-catagories'>
      <ul>
        {categories.map((c, index) => (
          <li className='li' key={index} onClick={() => setActiveBlog(c.link)}>
            <Link to={c.link}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catagories;
