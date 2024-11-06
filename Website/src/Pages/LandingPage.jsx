import React from "react";
import { Link } from "react-router-dom";
import Canvas from "../Components/Canvas";

export default function LandingPage(){
    return <>
    <header>
        <Canvas />
        <h1>Welcome to Our ClearAid</h1>
    </header>

        

        {/* Navigation Links */}
        <nav>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Create Account</button> 
          </Link>
          
          <Link to="/registerNGO">
            <button>Register as a NGO</button>
          </Link>
        </nav>
    </>
}