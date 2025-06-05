import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import { useNavVisibility } from '../context/NavVisibilityContext';

const Column1: React.FC = () => {
    return (
        <>
          <div className="footer1">
            <Link className="navbar-brand" to="/">
                Aberen<small>Coffee</small>
            </Link>
          </div>
        </>
    )
}

const Column2: React.FC = () => {

    const links = [
        {name: 'Espresso', to: '/'},
        {name: 'Latte', to: '/'},
        {name: 'Cappuccino', to: '/'},
        {name: 'Amaricano', to: '/'},
        {name: 'Coffee', to: '/'},
        {name: 'Abol', to: '/'},
    ]
    return (
        <>
          <div className="footer2">
            <h3>Shop</h3>
            <ul>
                {links.map((link, index)=> (
                    <li key={index}><Link to={link.to}>{link.name}</Link></li>
                ))}
            </ul>
          </div>
        </>
    )
}

const Column3: React.FC = () => {
    const links = [
        {name: 'Office', to: '/'},
        {name: 'Catering', to: '/'},
        {name: 'FAQ', to: '/'},
        {name: 'Subscription', to: '/'},
        {name: 'About Abren Coffee', to: '/'},
        {name: 'Coffee Production', to: '/'},
    ]
    return (
        <>
          <div className="footer2">
            <h3>Services</h3>
            <ul>
                {links.map((link, index)=> (
                    <li key={index}><Link to={link.to}>{link.name}</Link></li>
                ))}
            </ul>
          </div>
        </>
    )
}

const Column4: React.FC = () => {
    const links = [
        {name: 'Agreements', to: '/'},
        {name: 'Privacy', to: '/'},
        {name: 'Payments ', to: '/'},
        {name: 'Security', to: '/'},
        {name: 'Membership', to: '/'},
        {name: 'Terms and Regulations', to: '/'},
    ]
    return (
        <>
          <div className="footer2">
            <h3>Privacy and Terms</h3>
            <ul>
                {links.map((link, index)=> (
                    <li key={index}><Link to={link.to}>{link.name}</Link></li>
                ))}
            </ul>
          </div>
        </>
    )
}

const Footer: React.FC = () => {
    const { showFooter } = useNavVisibility();

    if (!showFooter) return null;
    const currentYear = new Date().getFullYear();
    const footList = [<Column1 key="1" />, 
                        <Column2 key="2" />,
                        <Column3 key="3" />,
                        <Column4 key="4" />,
                    ];

    return (
        <footer className="footer">
            <div className="overlay"></div>
            <div className="container">
                <div className="row">
                    {footList.map((FootComponent, index) => (
                        <div className="col" key={index}>
                            {FootComponent}
                        </div>
                    ))}
                </div>
                <div className="row-2">
                    <div className="col-md-12 text-center">
                        <p>
                            Copyright &copy; {currentYear} All rights reserved | Template by{' '}
                            <a href="https://esraelzerihun.com" target="_blank" rel="noopener noreferrer">
                                Esrael
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;