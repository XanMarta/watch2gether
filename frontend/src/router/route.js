//import { Home, About, Login, Register } from '../pages/index';
import Home from '../pages/HomePage'
import About from '../pages/AboutPage'
import Login from '../pages/LoginPage'
import Register from '../pages/RegisterPage'
import Profile from '../pages/ProfilePage'
import SearchPage from '../pages/SearchPage'
import RoomPage from '../pages/RoomPage'
import NotFound from '../pages/404NotFound'
import CreateRoomPage from '../pages/CreateRoomPage'
import JoinRoomPage from '../pages/JoinRoomPage'
import StreamingV2 from '../pages/StreamingV2'

const routes = [
  {
    path: '/',
    component: <Home />,
  },
  {
    path: '/about',
    component: <About />,
  },
  {
    path: '/login',
    component: <Login />,
  },
  {
    path: '/register',
    component: <Register />,
  },
  {
    path: '/profile/:id',
    component: <Profile />,
  },
  {
    path: '/search',
    component: <SearchPage />,
  },
  {
    path: '/search?query=:query',
    component: <SearchPage />,
  },
  {
    path: '/room/:id',
    component: <RoomPage />,
  },
  {
    path: '/createroom/:roomid',
    component: <CreateRoomPage />,
  },
  {
    path: '/joinroom/:roomid',
    component: <JoinRoomPage />,
  },
  {
    path: '/streamingv2',
    component: <StreamingV2 />,
  },
  {
    path: '*',
    component: <NotFound />,
  }
];

export default routes;