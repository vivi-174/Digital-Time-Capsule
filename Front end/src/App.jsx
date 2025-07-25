import { Routes, Route, useLocation } from 'react-router-dom';
import CreateCapsule from './CreateCapsule';
import ViewCapsules from './ViewCapsules';
import LandingPage from './LandingPage';
import Background from './Background';

import './App.css';

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/view" element={<ViewCapsules />} />
      </Routes>

    </>
  );
}

export default App;