import React from "react";
import { Link } from "react-router-dom";
import Canvas from "../Components/Canvas";

export default function LandingPage() {
  return <>
    <header>
      <Canvas />
      <h1>Welcome to ClearAid</h1>
    </header>



    {/* Navigation Links */}
    <section>
      <nav>
        <Link to="/login">
          <button>Login as a NGO</button>
        </Link>
        <Link to="/register">
          <button>Create Account</button>
        </Link>

        <Link to="/registerNGO">
          <button>Register as a NGO</button>
        </Link>
        <Link to="/donation-posts">
          <button>View Donation Posts</button>
        </Link>
        <Link to="/loginV">
          <button>Login as a Volunteer</button>
        </Link>

      </nav>
    </section>
  </>
}