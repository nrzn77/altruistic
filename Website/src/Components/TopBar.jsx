import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdMenu, MdClose } from "react-icons/md";
import { PiHandCoinsDuotone } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TopBar.css";

export function TopBar({ user, logout }) {
    const location = useLocation();
    // if(location.pathname === "/") return;
    const [menuOpen, setMenuOpen] = useState(false);
    const [seeMoreOpen, setSeeMoreOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSeeMore = () => {
        setSeeMoreOpen(!seeMoreOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    return (
        <nav>
            <h1 onClick={() => { navigate("/") }}><PiHandCoinsDuotone /> ClearAid</h1>
            <div className="hamburger" onClick={toggleMenu}>
                <MdMenu />
            </div>
            <div className={menuOpen ? 'menu show' : 'menu'}>
                <Link to="/login">
                    Login as NGO
                </Link>
                <Link to="/loginV">
                    Login as Volunteer
                </Link>
                <Link to="/register">
                    Create Account
                </Link>

                <Link to="/registerNGO">
                    Register as a NGO
                </Link>
                <Link to="/donation-posts">
                    View Donation Posts
                </Link>
                {/* <a href="/donate">Donate</a> */}
                {/* <div className="dropdown">
                    <a href="#" onClick={toggleSeeMore}>See More</a>
                    {seeMoreOpen && (
                        <ul className="dropdown-menu">
                            <li><a href="/services">Services</a></li>
                            <li><a href="/portfolio">Portfolio</a></li>
                            <li><a href="/blog">Blog</a></li>
                        </ul>
                    )}
                </div> */}
            </div>
            <div>
                <button className={`search-button ${searchOpen ? 'active' : ''}`} onClick={toggleSearch}>
                    {searchOpen ? <MdClose /> : <FaSearch />}
                </button>
                {searchOpen && <input type="text" className="search-input" placeholder="Search..." />}
            </div>
        </nav>
    );
}
