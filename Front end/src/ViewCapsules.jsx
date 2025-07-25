import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import confetti from 'canvas-confetti';
import './App.css';

function ViewCapsules() {
  const [capsules, setCapsules] = useState([]);
  const [timers, setTimers] = useState({});
  const [unlockedIds, setUnlockedIds] = useState({});
  const navigate = useNavigate();

  let unlockSound;
  try {
    unlockSound = new Audio(`${import.meta.env.BASE_URL}unlock.mp3`);
  } catch (err) {
    console.warn('Unlock sound could not be loaded:', err);
  }

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/capsule');
        const data = await res.json();
        if (res.ok) {
          setCapsules(data.capsules);

          const storedUnlocked = JSON.parse(localStorage.getItem('unlockedIds') || '{}');
          setUnlockedIds(storedUnlocked);
        } else {
          console.error('Failed to fetch capsules:', data.error);
        }
      } catch (err) {
        console.error('Error fetching capsules:', err);
      }
    };

    fetchCapsules();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = {};

      capsules.forEach((capsule) => {
        const unlockAt = new Date(capsule.unlockDate).getTime();
        const remaining = unlockAt - now;
        updatedTimers[capsule._id] = remaining > 0 ? remaining : 0;
      });

      setTimers(updatedTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [capsules]);

  const handleUnlock = (id) => {
    try {
      unlockSound && unlockSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.warn('Failed to play sound or confetti:', err);
    }

    const updated = { ...unlockedIds, [id]: true };
    setUnlockedIds(updated);
    localStorage.setItem('unlockedIds', JSON.stringify(updated));
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/capsule/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        const updatedCapsules = capsules.filter((c) => c._id !== id);
        setCapsules(updatedCapsules);

        const updatedUnlocked = { ...unlockedIds };
        delete updatedUnlocked[id];
        setUnlockedIds(updatedUnlocked);
        localStorage.setItem('unlockedIds', JSON.stringify(updatedUnlocked));
      } else {
        alert(`Failed to delete capsule: ${data.error}`);
      }
    } catch (err) {
      alert(`Error deleting capsule: ${err.message}`);
    }
  };

  const handleSave = (id) => {
    alert('Capsule saved!');
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="view-capsules-container">
      <ParticlesBackground />
      <h2 className="view-capsules-title">Your Memory Capsules</h2>
      <button onClick={() => navigate('/')} className="back-button click-animate">Back to Home</button>

      <div className="capsule-grid">
        {capsules.length === 0 ? (
          <p className="no-capsules-text">No capsules saved yet.</p>
        ) : (
          capsules.map((capsule, index) => {
            const timeLeft = timers[capsule._id] || 0;
            const isUnlocked = timeLeft <= 0;
            const hasBeenUnlocked = unlockedIds[capsule._id];
            const slideClass = index % 3 === 0 ? 'slide-left' : index % 3 === 1 ? 'slide-top' : 'slide-right';

            return (
              <div
                className={`capsule-card ${slideClass} ${hasBeenUnlocked ? 'capsule-flipped' : ''}`}
                key={capsule._id}
                style={{ '--delay': `${index * 100}ms` }}
                onClick={() => {
                  if (isUnlocked && !hasBeenUnlocked) handleUnlock(capsule._id);
                }}
              >
                <div className="capsule-inner">
                  {/* FRONT SIDE */}
                  <div className="capsule-front">
                    <div className="capsule-content">
                      {!isUnlocked ? (
                        <p className="timer-text">🔒 Locked – opens in {formatTime(timeLeft)}</p>
                      ) : (
                        <button className="unlock-button click-animate">
                          🔓 Click to Unlock Capsule
                        </button>
                      )}
                    </div>
                    <small className="timestamp">
                      Created: {new Date(capsule.createdAt).toLocaleString()} <br />
                      Opens At: {new Date(capsule.unlockDate).toLocaleString()}
                    </small>
                  </div>

                  {/* BACK SIDE */}
                  <div className="capsule-back">
                    <div className="capsule-content">
                      <div className="capsule-text">{capsule.message}</div>

                      {capsule.imagePath && (
                        <img
                          src={`http://localhost:5000/uploads/${capsule.imagePath}`}
                          alt="Capsule"
                          style={{ maxWidth: '100%' }}
                        />
                      )}
                    </div>

                    <div className="action-buttons">
                      <button className="click-animate" onClick={(e) => { e.stopPropagation(); handleSave(capsule._id); }}>Save</button>
                      <button className="click-animate" onClick={(e) => { e.stopPropagation(); handleDelete(capsule._id); }}>Delete</button>
                    </div>

                    <small className="timestamp">
                      Created: {new Date(capsule.createdAt).toLocaleString()} <br />
                      Opens At: {new Date(capsule.unlockDate).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ViewCapsules;



