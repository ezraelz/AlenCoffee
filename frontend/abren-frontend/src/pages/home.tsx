import React from 'react';
import './home.css'; // Make sure this path matches your file structure
import { Link} from 'react-router-dom';
import Trending_products from '../component/home/trending_products';
import RandomInfo from '../component/home/randomInfo';
import HomeStory from '../component/home/homeStory';
import HotDrink from '../component/home/hotDrink';
import HomeBlog from '../component/home/homeBlog';
import HappyCustomers from '../component/home/happyCustomers';
import HomeRegister from '../component/home/homeRegister';

const Home: React.FC = () => {
    return (
        <div className="home-section">
            <div className="home-content">
                <h1>Welcome to <span className="brand-name">Alen Coffee</span></h1>
                <p>Brewing joy one cup at a time.</p>
                <Link to={'/shop'} className="shop-button">
                   Shop Now
                </Link>
            </div>
            <Trending_products />
            <RandomInfo />
            <HotDrink />
            <HomeStory />
            <HomeBlog /> 
            <HappyCustomers />
            <HomeRegister />
        </div>
    );
};

export default Home;
