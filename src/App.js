import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./noLayout"; 
import HomePage from "./pages/HomePage";
import PostLostItem from "./pages/PostLostItem";
import PostFoundItem from "./pages/PostFoundItem";
import AboutUs from "./pages/AboutUs";
import FoundInstructions from "./pages/FoundInstruction";
import FoundInstructionsCmn from "./pages/FoundInstructionCmn";
import LostInstruction from "./pages/LostInstruction";
import LostInstructionCmn from "./pages/LostInstructionCmn";
import FoundItemsPage from "./pages/viewFoundList";
import LostItemsPage from "./pages/ViewLostList";
import ContactUs from "./pages/ContactUs";
import ContactUsUser from "./pages/ContactUsUser";
import ItemDetailFoundView from "./pages/viewDetailedFound";
import ItemDetailLostView from "./pages/viewDetailedLost";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import VerifyFound from "./pages/VerificationFound";
import VerifyLost from "./pages/verificationLost";
import VerificationFormFound from "./pages/verifyFormFound";
import VerificationFormLost from "./pages/verifyFormLost";
import SuccessfulMsg from "./pages/SuccessfulMsg";
import UserDashboard from "./pages/userDashboard";
import CmnNavbar from "./components/cmnNavbar";
import AboutUsUser from "./pages/AboutUsUser";
import ComingSoon from "./pages/futureUpdate";
import SuccessfullMsg1 from "./pages/successfulMsg1";
import Review from "./pages/review";
import ClaimRequest from "./pages/claimRequest";
import Accept from "./pages/accept";
import Reject from "./pages/reject";
import MyPost from "./pages/mypost";
import Notify from "./pages/notify";
import ConDetail from "./pages/contactDetail";













function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          
          <Route path="/" element={<HomePage />} />
          <Route path="/post-lost-item" element={<PostLostItem />} />
          <Route path="/post-found-item" element={<PostFoundItem />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/contact-user" element={<ContactUsUser />} />
          <Route path="/how-it-works-found" element={<FoundInstructions />} />
          <Route path="/how-it-works-found-cmn" element={<FoundInstructionsCmn />} />
          <Route path="/how-it-works-lost" element={<LostInstruction />} />
          <Route path="/how-it-works-lost-cmn" element={<LostInstructionCmn />} />
          <Route path="/view-found" element={<FoundItemsPage />} />
          <Route path="/view-lost" element={<LostItemsPage />} />
          <Route path="/view-detail-found" element={<ItemDetailFoundView />} />
          <Route path="/view-detail-lost" element={<ItemDetailLostView />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verification-found" element={<VerifyFound />} />
          <Route path="/verification-lost" element={<VerifyLost />} />
          <Route path="/verify-form-found" element={<VerificationFormFound />} />
          <Route path="/verify-form-lost" element={<VerificationFormLost />} />
          <Route path="/success-msg" element={<SuccessfulMsg />} />
          <Route path="/user-dash" element={<UserDashboard />} />
          <Route path="/cmn-nav" element={<CmnNavbar />} />
          <Route path="/about-user" element={<AboutUsUser />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/su-msg" element={<SuccessfullMsg1 />} />
          <Route path="/review" element={<Review />} />
          <Route path="/claim-request" element={<ClaimRequest />} />
          <Route path="/accept" element={<Accept />} />
          <Route path="/reject" element={<Reject />} />
          <Route path="/my-post" element={<MyPost />} />
          <Route path="/notify" element={<Notify />} />
          <Route path="/con-detail" element={<ConDetail />} />

          
          


        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

