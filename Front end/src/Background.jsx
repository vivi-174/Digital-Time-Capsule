import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

const Background = () => (
  <Canvas className="fixed top-0 left-0 w-full h-full z-0">
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <Stars radius={100} depth={50} count={5000} factor={4} fade />
    <OrbitControls enableZoom={false} />
  </Canvas>
);

export default Background;