import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarFooterPages = ["/login", "/signup", "/verification-found", "/verification-lost", "/verify-form-found", "/verify-form-lost", "/", "/about", "/contact", "/how-it-works-found-cmn", "/how-it-works-lost-cmn", "/coming-soon", "/admin-dash", "/view-my-claim", "/view-my-post", "/review-page", "/profile"]; // add more paths as needed

  const shouldHide = hideNavbarFooterPages.includes(location.pathname);

  return (
    <div className="app-layout">
      {!shouldHide && <Navbar />}
      <main className="main-content">{children}</main>
      {!shouldHide && <Footer />}
    </div>



  );
};

export default Layout;


