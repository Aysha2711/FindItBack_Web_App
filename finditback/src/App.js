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
import UserDashboard from "./pages/userDashboard";
import ClaimRequest from "./pages/ClaimRequest";
import PostItems from "./pages/PostItems";
import ReviewPage from "./pages/ReviewPage";
import Reviews from "./pages/Reviews";
import CmnNavbar from "./components/cmnNavbar";
import AboutUsUser from "./pages/AboutUsUser";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ComingSoon from "./pages/futureUpdate";
import ViewMyPost from "./pages/viewMyPost";
import ViewMyClaim from "./pages/viewMyClaim";
import ProfilePage from "./pages/ProfilePage";
import { FeedbackProvider } from "./context/FeedbackContext";









function App() {
  return (
    <FeedbackProvider>
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
          <Route path="/user-dash" element={<UserDashboard />} />
          <Route path="/admin-dash" element={<AdminDashboard />} />
          <Route path="/cmn-nav" element={<CmnNavbar />} />
          <Route path="/about-user" element={<AboutUsUser />} />
          <Route path="/claim-request" element={<ClaimRequest />} />
          <Route path="/post-items" element={<PostItems />} />
          <Route path="/review-page" element={<ReviewPage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/view-my-post" element={<ViewMyPost />} />
          <Route path="/view-my-claim" element={<ViewMyClaim />} />
          <Route path="/profile" element={<ProfilePage />} />




          </Routes>
        </Layout>
      </Router>
    </FeedbackProvider>
  );
}

export default App;


