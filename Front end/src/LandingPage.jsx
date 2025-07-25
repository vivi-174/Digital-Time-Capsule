import { useEffect, useState, useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Link } from 'react-router-dom';
import './App.css';

function LandingPage() {
  const images = [
    { src: "/images/img1.jpeg", caption: "Capture every moment" },
    { src: "/images/img2.jpeg", caption: "Relive the memories" },
    { src: "/images/img3.jpeg", caption: "Secure your past" },
    { src: "/images/img4.jpeg", caption: "Preserve your story" }
  ];

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const animationClasses = ["animate-from-top", "animate-from-left", "animate-from-bottom"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textAnimationClass, setTextAnimationClass] = useState("animate-from-top");

  useEffect(() => {
  const interval = setInterval(() => {
    const randomClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
  
    setTextAnimationClass(""); 
    setTimeout(() => {
      setTextAnimationClass(randomClass);
    }, 10);

    setCurrentIndex(prev => (prev + 1) % images.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="landing-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        options={{
          background: {
            color: { value: "#000000" },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 100,
              enable: true,
              opacity: 0.6,
              width: 1.5,
            },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "bounce" },
            },
            number: {
              value: 60,
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        }}
      />

      <div className="landing-layout">
        <div className={`left ${textAnimationClass}`}>
          <h1>Welcome to <span>Digital Time Capsule</span></h1>
          <p>Preserve your memories for the future.</p>
          <div className="buttons">
            <Link to="/create"><button>Create Capsule</button></Link>
            <Link to="/view"><button>View Capsules</button></Link>
          </div>
        </div>

        <div className="right">
          <div className="image-box">
            {images.map((img, index) => (
              <div
                key={index}
                className={`slide ${index === currentIndex ? "active" : ""}`}
                style={{ backgroundImage: `url(${img.src})` }}
              >
                <div className="caption">{img.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
