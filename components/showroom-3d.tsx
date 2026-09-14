'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Vector3 } from 'three';
import { viewpoints } from '@/data/showroom';
function Room() {
 const { scene } = useGLTF('/models/showroom.glb', '/draco/');
 useEffect(() => { scene.traverse((object) => { object.castShadow = true; object.receiveShadow = true; }); }, [scene]);
 return <primitive object={scene} />;
}
function CameraRig({ view }: { view: number }) {
 const { camera } = useThree();
 const [target] = useState(() => new Vector3(...viewpoints[0].target));
 const [goal] = useState(() => new Vector3());
 const [look] = useState(() => new Vector3());
 useFrame((_, delta) => {
  const selected = viewpoints[view];
  goal.set(...selected.position as [number, number, number]);
  look.set(...selected.target as [number, number, number]);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amount = reduced ? 1 : 1 - Math.exp(-delta * 3.5);
  camera.position.lerp(goal, amount); target.lerp(look, amount); camera.lookAt(target);
 });
 return null;
}
class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? <div className="viewer-fallback"><p>이 환경에서는 3D 보기를 사용할 수 없습니다.</p><span>아래에서 공간별 소재와 설계 설명을 확인해 주세요.</span></div> : this.props.children; }
}
export default function Showroom3D({ view }: { view: number }) {
 const ref = useRef<HTMLDivElement>(null);
 const [visible, setVisible] = useState(true);
 useEffect(() => { if (!ref.current) return; const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting)); observer.observe(ref.current); return () => observer.disconnect(); }, []);
 return <div ref={ref} className="canvas-wrap"><ViewerBoundary><Suspense fallback={<div className="viewer-fallback">공간을 불러오는 중입니다…</div>}><Canvas shadows dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} camera={{ position: [6.3, 4.6, 7.5], fov: 42 }} gl={{ antialias: true, alpha: false }} fallback={<div className="viewer-fallback">이 브라우저에서는 3D 공간을 지원하지 않습니다.</div>} onCreated={({ gl }) => gl.setClearColor('#eeefeb')}>
  <ambientLight intensity={.35} /><hemisphereLight args={['#ffffff', '#bdbdbd', .9]} />
  <directionalLight position={[-3, 7, 4]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-bias={-0.0008} />
  <Room /><CameraRig view={view} />
 </Canvas></Suspense></ViewerBoundary></div>;
}
