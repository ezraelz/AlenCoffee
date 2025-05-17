import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const Leftsidebar = () => {
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

   const handleScrollChange = () => {
      const currentScrollY = window.scrollY;
      setScrolledUp(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleScrollChange);
      return () => window.removeEventListener('scroll', handleScrollChange);
    }, []);
    const items = [
        {name: 'Newest', link: '', icon: ''},
        {name: 'Most Purchased', link: '', icon: ''},
        {name: 'Favorites', link: '', icon: ''},
        {name: 'Specials', link: '', icon: ''},
        {name: 'Catagories', link: '', icon: ''},
    ]
  return (
    <div className={scrolledUp ? 'shop-nav scrolled' : 'shop-nav'}>
      <div className="container">
         <ul className="list-card">
            {items.map((item) =>(
                <li className='links'>
                    <Link to={''}>{item.name}</Link>
                </li>
            ))}
         </ul>
        
      </div>
    </div>
  )
}

export default Leftsidebar
