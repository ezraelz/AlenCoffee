import React from 'react';
import './home.css'; // Make sure this path matches your file structure
import Sidebar from '../component/sidebar';
import { Link} from 'react-router-dom';
import Trending_products from '../component/home/trending_products';
import RandomInfo from '../component/home/randomInfo';
import HomeStory from '../component/home/homeStory';
import HotDrink from '../component/home/hotDrink';

const Home: React.FC = () => {
  
    
    return (
        <div className="home-section">
            <Sidebar />
            <div className="home-content">
                <h1>Welcome to <span className="brand-name">Aberen Coffee</span></h1>
                <p>Brewing joy one cup at a time.</p>
                <Link to={'/shop'}>
                   <a className="shop-button">Shop Now</a>
                </Link>
            </div>
            <Trending_products />
            <RandomInfo />
            <HotDrink />
            <HomeStory />
        </div>
    );
};

export default Home;
