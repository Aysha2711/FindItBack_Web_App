import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }) => {
  
  const location = useLocation();

  const hideNavbarFooterPages = ["/login", "/signup", "/verification-found", "/verification-lost", "/verify-form-found" ,"/verify-form-lost", "/success-msg", "/", "/about" , "/contact", "/how-it-works-found-cmn", "/how-it-works-lost-cmn" , "/coming-soon", "/su-msg" , "/accept" , "/reject"]; // add more paths as needed

  const shouldHide = hideNavbarFooterPages.includes(location.pathname);

  return (
    <>
      {!shouldHide && <Navbar />}
      <main>{children}</main>
      {!shouldHide && <Footer />}
    </>



  );
};

export default Layout;
