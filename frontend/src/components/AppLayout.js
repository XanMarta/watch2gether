import Navbar from "./navbar2";
import Footer from "./footer";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
        {children}
      <Footer />
    </>
  )
}

export default AppLayout;