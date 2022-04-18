import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLoginInfo } from "../redux/loginInfo";
import { useNavigate } from 'react-router-dom';


function IsLoggedIn() {
  //const loginForm = useSelector((state) => state.loginInfo.value);
  const loginForm = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (loginForm !== "") {
    return (
      <div>
        <Link to={"/profile/".concat(loginForm.id)}>Hello user {loginForm} </Link>
        <div onClick={() => { console.log("Logout"); dispatch(getLoginInfo("")); navigate("/") }}>Logout </div>
        {/* dispatch(logOut()) */}
      </div>
    )
  }
  return (
    <>
      <button className="btn btn-secondary" onClick={() => { navigate("/login") }}>
        Login
      </button>
      <button className="btn btn-secondary" onClick={() => { navigate("/register") }}>
        Register
      </button>
      {/* <p>{loginForm.username}</p> */}
      {/* <Link to="/register"
        class="">
        Register</Link> */}
    </>
  )
}

function Nav() {
  const navigate = useNavigate();
  return (
    <>
      <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand">Watch2gether</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-center">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link active" to="/">Home</Link>
              </li>
              <li class="nav-item">
                {/* <a class="nav-link" to="/about">About us</a> */}
                <Link class="nav-link active" to="/about">About us</Link>
              </li>
              <li class="nav-item">
                {/* <a class="nav-link" to="/">Contact</a> */}
                <Link class="nav-link active" to="/">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <IsLoggedIn />
      </nav>
    </>
  );
}

export default Nav;