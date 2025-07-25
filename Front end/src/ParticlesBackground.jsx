import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim'; 

function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); 
  }, []);

  return (
    <Particles
      id="tsparticless"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: '#000' },
        particles: {
          number: { value: 60 },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
        },
      }}
    />
  );
}

export default ParticlesBackground;
