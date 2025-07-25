import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import './App.css';

function CreateCapsule() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [openDate, setOpenDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
  
    const formData = new FormData();
    formData.append('message', text);
    if (file) formData.append('image', file);
    formData.append('unlockDate', openDate);
  
    try {
      const res = await fetch('http://localhost:5000/api/capsule/create', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setText('');
        setFile(null);
        setOpenDate('');
        navigate('/view');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    }
  };

  return (
    <div className="create-capsule-container">
      <ParticlesBackground />
      <form onSubmit={handleSubmit} className="capsule-form">
        <h2>Create a Memory Capsule</h2>

        <label>Memory (Text / Letter)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something special..."
        />

        <label>Attach a File (Optional)</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept="image/*,.pdf,.doc,.docx"
        />

        <label>Open On (Date & Time)</label>
        <input
          type="datetime-local"
          value={openDate}
          onChange={(e) => setOpenDate(e.target.value)}
          required
        />

        <button type="submit">Save Capsule</button>
      </form>
    </div>
  );
}

export default CreateCapsule;
