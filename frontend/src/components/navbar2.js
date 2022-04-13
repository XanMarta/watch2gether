import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLoginInfo } from "../redux/loginInfo";
import { useNavigate } from 'react-router-dom';
//import { Button } from 'semantic-ui-react'
import { Dropdown, Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';


function UserProfile() {
  const loginForm = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <>
      {/* <a class="navbar-brand" href="#">
        <img src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/logo_white.png" width="30" height="30" alt="logo"></img>
        BootstrapBay
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-list-4" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button> */}
      {/* <Button primary>Primary</Button> */}
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Hello user {loginForm}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { navigate("/profile/".concat(loginForm.id)) }}>Profile</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Change Password</Dropdown.Item>
          <Dropdown.Item onClick={() => { console.log("Logout"); dispatch(getLoginInfo("")); navigate("/") }} >Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  )
}

function IsLoggedIn() {
  //const loginForm = useSelector((state) => state.loginInfo.value);
  const rightStyle = {
    "padding-right": "0.5rem",
  }
  const loginForm = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  if (loginForm !== "") {
    return (
      <div style={rightStyle}>
        {/* <Link to={"/profile/".concat(loginForm.id)}>Hello user {loginForm} </Link>
        <div onClick={() => { console.log("Logout"); dispatch(getLoginInfo("")); navigate("/") }}>Logout </div> */}
        {/* dispatch(logOut()) */}
        <UserProfile />
      </div>
    )
  }
  return (
    <>
      <div style={rightStyle}>
        <button type="button" class="btn btn-outline-secondary" onClick={() => { navigate("/login") }}>Login</button>
        <button type="button" class="btn btn-outline-secondary" onClick={() => { navigate("/register") }}>Register</button>
      </div>
    </>
  )
}

function navbar() {
  const middleStyle = {
    "padding-left": "40rem",
  }
  // const rightStyle = {
  //   "padding-right": "0.5rem",
  // }
  const style = {
    "padding": "1.5rem",
  }

  const logo = {
    "padding-left": "1rem"
  }
  return (
    <>
      <Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
        <Navbar.Brand style={logo}>Watch2gether</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" style={middleStyle}>
            <Nav.Link style={style}><Link to="/">Home</Link></Nav.Link>
            <Link to="/">
              <Nav.Link style={style}>Feature</Nav.Link>
            </Link>
            {/* <NavDropdown title="YEET" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav>
            <Link to="/">
              <Nav.Link style={style}><Link to="/about">About us</Link></Nav.Link>
            </Link>
            <Link to="/">
              <Nav.Link style={style}>
              <Link to="/">Contact us</Link>
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
        <IsLoggedIn />
      </Navbar>
    </>
  );
}

export default navbar;