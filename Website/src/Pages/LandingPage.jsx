import React from "react";
import { TopBar } from "../Components/TopBar";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PiHandCoinsDuotone } from "react-icons/pi";
import Canvas from "../Components/Canvas";
import ICON from "../assets/react.svg"
import ICON2 from "../assets/react - Copy.svg"

export default function LandingPage({userRole, setUserRole}) {

  useEffect(() => {
    const observer = new IntersectionObserver((entries, self) => {
      entries.map(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          self.unobserve(entry.target)
        }
      })
    },
      {
        threshold: .7,
      });
    let elements = document.querySelectorAll(".hidden");
    for (let elem of elements) {
      observer.observe(elem)
    }
  }, [])
  return <>
    <header>
      <TopBar userRole={userRole} setUserRole={setUserRole}/>
      <Canvas />
      <h1 className="header-title"><PiHandCoinsDuotone />ClearAid</h1>
      <div className="header-text">Altruism Discretion Transparency</div>
    </header>
    <section className="section-1">
      <div className="decoration one"></div>
      <div className="decoration two"></div>
      <div className="section-content">
        <a href="#donations">
          <div className="hidden hidden-side" style={{ transitionDelay: "0s" }}>
            <img src={ICON} />
            <p>Your trusted place for making donations</p>
          </div>
        </a>
        <a href="#NGOs">
          <div className="hidden hidden-side" style={{ transitionDelay: "0.1s" }}>
            <img src={ICON2} />
            <p>Make requests for donations</p>
          </div>
        </a>
        <a href="#Volunteer">
          <div className="hidden hidden-side" style={{ transitionDelay: "0.2s" }}>
            <img src={ICON} />
            <p>Sign-up as a Volunteer for hire</p>
          </div>
        </a>
      </div>
    </section>
    <section className="section-2">
      <div className="section-content">
        <h2>At ClearAid, we:</h2>
        <ol>
          <li className="hidden hidden-default" style={{ transitionDelay: "0s" }}>
            <b>value your privacy. </b>
            No data is collected when you make a donation. You don't even need to create an account.
          </li>
          <li className="hidden hidden-default" style={{ transitionDelay: "0.1s" }}>
            <b>practice transparency. </b>
            Moderators ensure that requests for donations authentic and transparent. Our system is open for auditing.
          </li>
          <li className="hidden hidden-default" style={{ transitionDelay: "0.2s" }}>
            <b>ensure authenticity. </b>
            NGOs and volunteers are verified using their License numbers and NIDs.
          </li>
          <li className="hidden hidden-default" style={{ transitionDelay: "0.3s" }}>
            <b>make things convenient. </b>
            You can make donations physically, through mobile banking, or even through our inbuilt system.
          </li>
        </ol>
      </div>
    </section>

    {/* <section>
      <p className="hidden hidden-default">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        <Link to="/donation-posts">
          <button>Donate Now!</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p className="hidden hidden-default">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        <Link to="/register">
          <button>Register as a Volunteer</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p className="hidden hidden-default">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        
      </p>
      <img src={ICON} />
    </section> */}

    <section id="donations" className="section-3 infodumps" style={{ backgroundImage: `url(${ICON2})` }}>
      <svg style={{ fill: "var(--blue)" }} width="100%" height="70" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path id="wavepath" d="M0,0  L110,0C35,150 35,0 0,100z"></path>
      </svg>
      <div className="section-content">
        <h1 className="hidden hidden-default">Donors!</h1>
        <p className="hidden hidden-default" style={{ transitionDelay: "0.1s" }}>Are you looking for a place to make donations? At ClearAid, certified and validated NGOs make posts requesting money for various causes. Donate here, through our inbuilt system, or make them however you are comfortable. All donations are anonymous, and you do not need to create any account.</p>
        <Link to="/donation-posts">
          Donate Now!
        </Link>
      </div>
    </section>
    <section id="NGOs" className="section-3 infodumps" style={{ backgroundImage: `url(${ICON})` }}>
      <div className="section-content">
        <h1 className="hidden hidden-default">NGOs!</h1>
        <p className="hidden hidden-default" style={{ transitionDelay: "0.1s" }}>Do you need funds? Is there some cause that needs monetary aid? Post your plight here, and it will be posted for all to see.</p>
        <Link to="/registerNGO">
          Register as a NGO
        </Link>
      </div>
    </section>
    <section id="Volunteer" className="section-3 infodumps" style={{ backgroundImage: `url(${ICON2})` }}>
      <div className="section-content">
        <h1 className="hidden hidden-default">Volunteers!</h1>
        <p className="hidden hidden-default" style={{ transitionDelay: "0.1s" }}>Do you have time on your hands? Do you wish to serve the community with your physical strength or labour? Register an account here, and NGOs can contact you when they need your help!</p>
        <Link to="/register">
          Register as a Volunteer
        </Link>
      </div>
    </section>

  </>
}