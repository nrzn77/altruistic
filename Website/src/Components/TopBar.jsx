import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import "./TopBar.css";

export function TopBar({ userRole, setUserRole }) {
    // const location = useLocation();
    const searchBarRef = useRef(null);
    // if(location.pathname === "/") return;
    const [menuOpen, setMenuOpen] = useState(false);
    const [seeMoreOpen, setSeeMoreOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        signOut(auth)
            .then(() => {
                setUserRole(null);
                console.log("User logged out")
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
            });
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleSeeMore = () => {
        setSeeMoreOpen(!seeMoreOpen);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchBarRef.current.value
            if(searchTerm === "") return
            setSearchOpen(false);
            console.log(searchTerm)
            navigate('/search/' + encodeURIComponent(searchTerm))
        }
    }

    useEffect(() => {
        if (searchOpen) {
            searchBarRef.current.focus();
        }
    }, [searchOpen])

    return (
        <nav style={menuOpen ? { backgroundColor: "var(--blue)" } : {}} onClick={() => { if (menuOpen) setMenuOpen(false) }}>

            <h1 className={searchOpen ? ' searchmode' : ''} onClick={() => { navigate("/") }}><img src="./sweood.svg" className="main-logo" /><span>ClearAid</span></h1>

            <div className={(menuOpen ? 'menu menu-show' : 'menu') + (searchOpen ? ' searchmode' : '')}>
                {!userRole && <>
                    <Link to="/login">
                        Login as NGO
                    </Link>
                    <Link to="/loginV">
                        Login as Volunteer
                    </Link>
                    <Link to="/register">
                        Become a Volunteer
                    </Link>

                    <Link to="/registerNGO">
                        Register an NGO
                    </Link></>
                }
                {userRole == "ngo" &&
                    <Link to="/dashboard">
                        NGO Dashboard
                    </Link>
                }
                {userRole == "volunteer" &&
                    <Link to="/dashboardVolun">
                        Volunteer Dashboard
                    </Link>
                }
                {
                    userRole && <a onClick={logout} style={{ cursor: "pointer" }}>
                        Logout
                    </a>
                }
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
            {searchOpen &&
                <input type="text" className="search-input" placeholder="Search..." ref={searchBarRef}
                    onKeyDown={e=>handleKeyDown(e)} />
            }
            <div>
                <div className={searchOpen ? ' searchmode' : 'hamburger'} onClick={toggleMenu}>
                    <MdMenu />
                </div>

                <button className={`search-button ${searchOpen ? 'active' : ''}`} onClick={toggleSearch}>
                    {searchOpen ? <MdClose /> : <FaSearch />}
                </button>
            </div>
        </nav>
    );
}
