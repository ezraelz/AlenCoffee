import React from 'react'
import { Link } from 'react-router-dom'

const Leftsidebar = () => {
    const items = [
        {name: 'Newest', link: '', icon: ''},
        {name: 'Most Purchased', link: '', icon: ''},
        {name: 'Favorites', link: '', icon: ''},
        {name: 'Specials', link: '', icon: ''},
        {name: 'Catagories', link: '', icon: ''},
    ]
  return (
    <div className='leftSidebar'>
      <div className="container">
         <h3>Welcome to the Shop</h3>
         <ul className="list-card">
            {items.map((item) =>(
                <li >
                    <Link to={''}>{item.name}</Link>
                </li>
            ))}
         </ul>
        
      </div>
    </div>
  )
}

export default Leftsidebar
