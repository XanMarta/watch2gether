import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

function RegisterUI(props) {
  const registerChange = props.registerChange;
  const registerHandler = props.registerHandler;
  return (
    <>
      <div class="row">
        <div class="col-md-4 offset-md-4">
          <Form class="col-md-4 offset-md-4">
            <div style={{ "padding-top": "5rem" }}>
              <h1>Register</h1>
            </div>
            <Form.Group className="col-12 pt-3">
              <Form.Label>Email</Form.Label>
              {/* <Form.Control type="text" placeholder="Enter Email" onChange={registerChange} /> */}
              <input type="text" name="Email" class="form-control" placeholder="Email" onChange={registerChange}></input>
            </Form.Group>
            <Form.Group className="col-12 pt-3">
              <Form.Label>Phone Number</Form.Label>
              {/* <Form.Control type="text" placeholder="Phone Numer" onChange={registerChange} /> */}
              <input type="text" name="PhoneNumber" class="form-control" placeholder="PhoneNumber" onChange={registerChange}></input>
            </Form.Group>
            <Form.Group className="col-12 pt-3">
              <Form.Label>Username</Form.Label>
              {/* <Form.Control type="text" placeholder="Enter Username" onChange={registerChange} /> */}
              <input type="text" name="username" class="form-control" placeholder="Username" onChange={registerChange}></input>
            </Form.Group>
            <Form.Group className="col-12 pt-3">
              <Form.Label>Password</Form.Label>
              {/* <Form.Control type="password" placeholder="Password" onChange={registerChange} /> */}
              <input type="password" name="password" class="form-control" placeholder="password" onChange={registerChange}></input>
            </Form.Group>
            {/* <Button variant="primary" type="submit">
              Submit
            </Button> */}
            <div class="col-12 pt-3">
              <Button variant="secondary" onClick={registerHandler}>Register</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default RegisterUI