//import logo from './logo.svg';
import './App.css';
////////////////////////////////import Navbar from './components/navbar'
import AppLayout from './components/AppLayout'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routes from './router/route'
import { Fragment } from 'react';

const Middle = () => {
  return (
    // <div className="bg-neutral-400">
    <Routes>
      {
        routes.map((route) => {
          return (
            <Fragment>
              <Route path={route.path} element={route.component}></Route>
            </Fragment>
          );
        })
      }
    </Routes>
    // </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          <Middle />
        </AppLayout>
      </div>
    </Router >
  );
}

export default App;
