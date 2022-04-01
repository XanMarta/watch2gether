import Navbar from "./navbar";
import Footer from "./footer";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {/* <div className="mb-2.5"> */}
      {children}
      {/* </div> */}
      <Footer />
    </>
  )
}

export default AppLayout;