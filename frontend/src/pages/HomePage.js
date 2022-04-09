import { useState, Fragment, useEffect } from 'react';
import { useSelector } from "react-redux";
import Button from '../components/General/Button'
import { useNavigate } from 'react-router-dom';
import Card from "../components/General/Card"


function HomePage() {
  const loginForm = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  const style = {
    "margin-top": "20px",
    "margin-left": "30rem",
  }

  // const background = {
  //   background-image: "url('https://c0.wallpaperflare.com/preview/639/814/358/japan-tokyo-japanese-lights.jpg')",
  //   //"background-color": "#cccccc",
  // }
  function EnterRoom(e) {
    navigate("/search")
    //[url('https://www.kcpinternational.com/wp-content/uploads/2011/10/tokyo-night-life.jpg')]
  }
  if (loginForm !== "") {
    return (
      <div className="aligns-items-center justify-content-center" style={style}>
        <section>
          <h1>Welcome back. What are you gonna do today?</h1>
        </section>
        <section>
          <h1>Welcome user to our site!</h1>
        </section>
        {/* <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { EnterRoom(e) }}
            buttonName={"Enter this room"}></Button> */}
        {/* <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { navigate("/testcall") }}
            buttonName={"Video call test"}></Button> */}
        <button type="button" class="btn btn-danger" onClick={(e) => { EnterRoom(e) }}>Enter this room</button>
        <button type="button" class="btn btn-danger" onClick={(e) => navigate("/testcall")}>Video call</button>
        <br></br>
      </div>
    );
  } else {
    return (
      <>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
      </>
    );
  }
}

export default HomePage;