import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PiHandCoinsDuotone } from "react-icons/pi";
import Canvas from "../Components/Canvas";
import ICON from "../assets/react.svg"

export default function LandingPage() {

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
        threshold: .5,
      });
      let elements = document.querySelectorAll(".hidden");
      for(let elem of elements){
        observer.observe(elem)
      }
  }, [])
  return <>
    <header>
      <Canvas />
      <h1><PiHandCoinsDuotone />ClearAid</h1>
      <div>Altruism Discretion Transparency</div>
    </header>
    <section>
      <h2>Your trusted place for making donations</h2>
    </section>
    <section>
      <p className="hidden">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        <Link to="/donation-posts">
          <button>Donate Now!</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p className="hidden">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        <Link to="/register">
          <button>Register as a Volunteer</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p className="hidden">Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br />
        <Link to="/registerNGO">
          <button>Register as a NGO</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>

  </>
}