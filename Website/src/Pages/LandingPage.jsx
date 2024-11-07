import React from "react";
import { Link } from "react-router-dom";
import { PiHandCoinsDuotone } from "react-icons/pi";
import Canvas from "../Components/Canvas";
import ICON from "../assets/react.svg"

export default function LandingPage() {
  return <>
    <header>
      <Canvas />
      <h1><PiHandCoinsDuotone />ClearAid</h1>
      <div>Altruism Discretion Transparency</div>
    </header>

    <section>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br/>
        <Link to="/donation-posts">
          <button>Donate Now!</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br/>
        <Link to="/register">
          <button>Register as a Volunteer</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>
    <section>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aspernatur quod voluptatem incidunt tenetur delectus laboriosam exercitationem blanditiis ducimus reiciendis vero adipisci corrupti obcaecati, facilis nemo nesciunt neque vel dignissimos sed. Impedit tempora soluta ipsum molestiae sed eum harum distinctio doloribus tempore vitae quisquam obcaecati nulla, optio iusto, aliquid voluptate!<br/>
        <Link to="/registerNGO">
          <button>Register as a Volunteer</button>
        </Link>
      </p>
      <img src={ICON} />
    </section>

  </>
}