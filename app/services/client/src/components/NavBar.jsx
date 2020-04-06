import React from 'react';
import {Link} from 'react-router-dom';

const NavBar = (props) => (
    // eslint-disable-next-line
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <section className="container">
            <div className="navbar-brand">
                <img src={props.logo} alt="logoDelijn" width="150" height="15"/>
                <strong className="navbar-item">{props.title}</strong>
                <span
                    className="nav-toggle navbar-burger"
                    onClick={() => {
                        let toggle = document.querySelector(".nav-toggle");
                        let menu = document.querySelector(".navbar-menu");
                        toggle.classList.toggle("is-active");
                        menu.classList.toggle("is-active");
                    }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link to="/" className="navbar-item">Home</Link>
                    <Link to="/stops" className="navbar-item">Stops</Link>
                    <Link to="/vehicles" className="navbar-item">Vehicles</Link>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            Search
                        </a>

                        <div className="navbar-dropdown">
                            <Link to="/search/s/id" className="navbar-item">Stop id</Link>
                            <Link to="/search/s/line" className="navbar-item" >Line</Link>
                            <Link to="/search/s/city" className="navbar-item" >City</Link>
                            <hr className="navbar-divider"/>
                            <Link to="/search/v/id" className="navbar-item" >Vehicle id</Link>
                            <Link to="/search/v/type" className="navbar-item" >Vehicle type</Link>
                        </div>
                    </div>


                </div>
                <div className="navbar-end">
                    {!props.isAuthenticated &&
                    <Link to="/register" className="navbar-item">Register</Link>
                    }
                    {!props.isAuthenticated &&
                    <Link to="/login" className="navbar-item">Log In</Link>
                    }
                    {props.isAuthenticated &&
                    <Link to="/logout" className="navbar-item">Log Out</Link>
                    }
                </div>
            </div>
        </section>
    </nav>
);

export default NavBar;