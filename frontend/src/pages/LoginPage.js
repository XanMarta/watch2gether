import LoginForm from '../components/LoginPage/LoginUI'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { login } from "../adapters/auth.service"
import { getLoginInfo } from "../redux/loginInfo";

function LoginPage() {
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });
  const dispatch = useDispatch();
  //let IsLoggedIn = false;
  useEffect(() => {
    console.log('use effect random');
  }, [])
  const navigate = useNavigate();
  //const errorMsg = useSelector((state) => state.loginError);

  function loginChange(e) {
    console.log("loginChange");
    const getFieldName = e.target.getAttribute('name');
    const getFieldValue = e.target.value;

    const newTaskForm = { ...loginForm }
    newTaskForm[getFieldName] = getFieldValue;
    setLoginForm(newTaskForm);
  }

  function loginHandler(e) {
    console.log("loginHandler");
    e.preventDefault();
    const _loginForm = {
      ...loginForm
    };
    setLoginForm(_loginForm);
    //in case the Backend team is lazy
    if (_loginForm.username === "hoang" && _loginForm.password === "1") {
      dispatch(getLoginInfo(_loginForm.username));
      navigate("/");
      //return;
    }
    //in case they are a good guy
    dispatch(login(_loginForm.username, _loginForm.password)).then(() => {
      navigate("/");
      //IsLoggedIn = true;
    }).catch((err) => {
      //dispatch(loginError());
      console.log(err.message);
    })
  }
  return (
    <>
      <h1>This is login page</h1>
      <div className="mt-0 my-32 flex justify-center items-center border-4 border-indigo-500/100">
        <LoginForm
          loginChange={loginChange}
          loginHandler={loginHandler}
        //loginChange={e => setLoginForm(e.target.value)}
        />
      </div>
    </>
  );
}

export default LoginPage