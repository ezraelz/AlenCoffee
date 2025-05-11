import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="ftco-footer ftco-section img">
            <div className="overlay"></div>
            <div className="container">
                <div className="row mb-5">
                    {/* Footer Widgets */}
                </div>
                <div className="row">
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