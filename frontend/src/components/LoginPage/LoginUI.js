// import InputField from '../General/InputField'
// import Button from '../General/Button'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function LoginUI(props) {
  const loginChange = props.loginChange;
  const loginHandler = props.loginHandler;
  return (
    <>
      {/* <div class="row">
        <div class="col-md-4 offset-md-4">
          <div class="login-form bg-light mt-4 p-4">
            <div class="row g-3">
              <h4>Please login</h4>
              <div class="col-12">
                <label>Username</label>
                <input type="text" name="username" class="form-control" placeholder="Username" onChange={loginChange}></input>
              </div>
              <div class="col-12">
                <label>Password</label>
                <input type="password" name="password" class="form-control" placeholder="Password" onChange={loginChange}></input>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="rememberMe"></input>
                  <label class="form-check-label" for="rememberMe"> Remember me</label>
                </div>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-dark float-end" onClick={loginHandler}>Login</button>
              </div>
            </div>
            <hr class="mt-4"></hr>
            <div class="col-12">
              <p class="text-center mb-0">Have not account yet? <a href="#">Signup</a></p>
            </div>
          </div>
        </div>
      </div> */}
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <Form class="col-md-4 offset-md-4">
            <div style={{ "padding-top": "5rem" }}>
              <h1>Login</h1>
            </div>
            <Form.Group className="col-12 pt-3">
              <Form.Label>Username</Form.Label>
              {/* <Form.Control as='input' type="text" placeholder="Enter Username" onChange={(e) => loginChange(e)}></Form.Control> */}
              <input type="text" name="username" class="form-control" placeholder="Username" onChange={loginChange}></input>
            </Form.Group>

            <Form.Group className="col-12 pt-3">
              <Form.Label>Password</Form.Label>
              {/* <Form.Control as='input' type="password" placeholder="Password" onChange={(e) => loginChange(e)}></Form.Control> */}
              <input type="password" name="password" class="form-control" placeholder="Password" onChange={loginChange}></input>
            </Form.Group>
            {/* <Button variant="primary" type="submit">
              Submit
            </Button> */}
            <div class="col-12 pt-3">
              <Button variant="secondary" onClick={(e) => loginHandler(e)}>Sign in</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default LoginUI