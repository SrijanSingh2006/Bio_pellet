import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./components/Footer/Footer";
import Locator from "./components/Locator";
import Receipt from "./components/Receipt";
import Analytics from "./components/Analytics";
import FarmerFeatures from "./components/FarmerFeatures";
import IndustryIntegration from "./components/IndustryIntegration";
import MLHub from "./components/MLHub";
import FarmerAIHub from "./components/FarmerAIHub";
import EnterpriseMLHub from "./components/EnterpriseMLHub";
import CommandCenter from "./components/CommandCenter";
import VoiceAgent from "./components/VoiceAgent";

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
              </>
            }
          />
          <Route path="/locator" element={<Locator />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/farmer-features" element={<FarmerFeatures />} />
          <Route path="/industry" element={<IndustryIntegration />} />
          <Route path="/ml-hub" element={<MLHub />} />
          <Route path="/farmer-ai" element={<FarmerAIHub />} />
          <Route path="/enterprise-ml" element={<EnterpriseMLHub />} />
          <Route path="/command-center" element={<CommandCenter />} />
        </Routes>
        <VoiceAgent />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
