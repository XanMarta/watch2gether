import { useState, Fragment, useEffect } from 'react';
import { useSelector } from "react-redux";
import Button from '../components/General/Button'
import { useNavigate } from 'react-router-dom';
import Card from "../components/General/Card"


function HomePage2() {
  const loginForm = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  function EnterRoom(e) {
    navigate("/search")
    //[url('https://www.kcpinternational.com/wp-content/uploads/2011/10/tokyo-night-life.jpg')]
  }
  if (loginForm !== "") {
    return (
      <div className="bg-emerald-300 mb-0">
        <h1>Welcome back. What are you gonna do today?</h1>
        <div className="h-14 pt-40 pb-60 pl-80 pr-80">
          <div class="h-14 border border-sky-500 bg-gradient-to-r from-cyan-500 to-blue-500">
            <h1>Welcome to our site!</h1>
          </div>
          <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { EnterRoom(e) }}
            buttonName={"Enter this room"}></Button>
          <br></br>
          <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { navigate("/testcall") }}
            buttonName={"Video call test"}></Button>
          <br></br>
        </div>
      </div>
    );
  }
  return (
    // <div className="mb-1 bg-[url('https://www.kcpinternational.com/wp-content/uploads/2011/10/tokyo-night-life.jpg')]">
    <div className="bg-emerald-300 mb-0">
       <h1>Welcome back. What are you gonna do today?</h1>
        <div className="h-14 pt-40 pb-60 pl-80 pr-80">
          <div class="h-14 border border-sky-500 bg-gradient-to-r from-cyan-500 to-blue-500">
            <h1>Welcome to our site!</h1>
          </div>
          <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { EnterRoom(e) }}
            buttonName={"Enter this room"}></Button>
          <br></br>
          <Button
            bgColor={"yellow-500"}
            size={"text-xl"}
            type={"button"}
            onClick={(e) => { navigate("/testcall") }}
            buttonName={"Video call test"}></Button>
          <br></br>
        </div>
    </div >
  );
}

export default HomePage2;