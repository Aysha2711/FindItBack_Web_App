import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutusCss.css";


const AboutUsUser = () => {
  const navigate = useNavigate();

  const goToLostInstructions = () => {
    navigate("/how-it-works-lost");
  };

  const goToFoundInstructions = () => {
    navigate("/how-it-works-found");
  };

  return (
    <>
      <div className="about-us">
       
        <section className="hero-section">
          <div className="hero-text">
            <h1>Connecting People. Returning What Matters.</h1>
            <p>
              A community-driven platform to reunite people with their lost belongings.
            </p>
          </div>
        </section>

        <section className="why-we-exist">
          <h2>Why We Exist</h2>
          <div className="why-box">
            <p>
              Our goal is simple — to help people return lost items and find what they’ve lost,
              with the help of kind-hearted finders. We believe in trust, privacy, and community.
            </p>
          </div>
        </section>

       
        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step-card" onClick={goToLostInstructions}>
              <span className="icon">🔍</span>
              <h3>Lost Something?</h3>
              <p>Post a report with details.</p>
            </div>
            <div className="step-card" onClick={goToFoundInstructions}>
              <span className="icon">📷</span>
              <h3>Found Something?</h3>
              <p>Upload and help return it.</p>
            </div>
            <div className="step-card">
              <span className="icon">✔️</span>
              <h3>We Verify</h3>
              <p>Claims are checked for trust and privacy.</p>
            </div>
          </div>
        </section>
      </div>

    </>
  );
};

export default AboutUsUser;
