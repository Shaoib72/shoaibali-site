import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Grid, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useMotionPref } from '../context/MotionContext';

const TEAL = '#2a9d8f';
const CORAL = '#e76f51';
const GOLD = '#e9a23b';
const SKY = '#5b9fd4';
const BG = '#e8eef8';

function MouseParallax({ paused, mouse }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.4, 10));

  useFrame((_, delta) => {
    if (paused) return;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    target.current.x = mx * 1.4;
    target.current.y = 0.35 + my * 0.7;
    target.current.z = 10;
    camera.position.lerp(target.current, 1 - Math.exp(-1.2 * delta));
    camera.lookAt(mx * 0.35, my * 0.2, -6);
  });

  return null;
}

function RingTunnel({ paused }) {
  const group = useRef(null);
  const count = 28;
  const spacing = 1.85;

  const rings = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        z: -i * spacing,
        scale: 1 + (i % 4) * 0.08,
        color: [TEAL, CORAL, GOLD, SKY][i % 4],
        rot: (i % 2 === 0 ? 1 : -1) * 0.15,
      })),
    [count, spacing]
  );

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.children.forEach((mesh) => {
      mesh.position.z += delta * 1.6;
      mesh.rotation.z += delta * mesh.userData.spin * 0.35;
      if (mesh.position.z > 4) mesh.position.z -= count * spacing;
    });
    group.current.rotation.z = Math.sin(performance.now() * 0.00008) * 0.05;
  });

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {rings.map((ring, i) => (
        <mesh
          key={i}
          position={[0, 0, ring.z]}
          scale={ring.scale}
          userData={{ spin: ring.rot }}
          rotation={[0, 0, (i / count) * Math.PI]}
        >
          <torusGeometry args={[3.2, 0.035, 8, 64]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.35}
            transparent
            opacity={0.55}
            roughness={0.35}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingSolids({ paused }) {
  const group = useRef(null);
  const items = useMemo(
    () => [
      { pos: [-4.2, 2.2, -6], geo: 'ico', color: TEAL, s: 0.55 },
      { pos: [4.5, 1.4, -8], geo: 'oct', color: CORAL, s: 0.5 },
      { pos: [-3.2, -1.8, -10], geo: 'box', color: GOLD, s: 0.45 },
      { pos: [3.6, -1.2, -5], geo: 'torus', color: SKY, s: 0.4 },
      { pos: [0.5, 2.8, -12], geo: 'ico', color: CORAL, s: 0.35 },
      { pos: [-5, 0.2, -14], geo: 'oct', color: TEAL, s: 0.6 },
      { pos: [5.2, -2.2, -11], geo: 'box', color: GOLD, s: 0.38 },
      { pos: [1.8, -2.6, -7], geo: 'ico', color: SKY, s: 0.42 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.y += delta * 0.025;
    group.current.children.forEach((child, i) => {
      child.rotation.x += delta * (0.06 + i * 0.01);
      child.rotation.y += delta * (0.05 + i * 0.008);
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <Float
          key={i}
          speed={paused ? 0 : 0.45 + (i % 3) * 0.12}
          rotationIntensity={paused ? 0 : 0.25}
          floatIntensity={paused ? 0 : 0.35}
        >
          <mesh position={item.pos} scale={item.s}>
            {item.geo === 'ico' && <icosahedronGeometry args={[1, 0]} />}
            {item.geo === 'oct' && <octahedronGeometry args={[1, 0]} />}
            {item.geo === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
            {item.geo === 'torus' && <torusGeometry args={[0.8, 0.28, 16, 48]} />}
            <meshStandardMaterial
              color={item.color}
              wireframe={i % 2 === 0}
              transparent
              opacity={i % 2 === 0 ? 0.55 : 0.4}
              emissive={item.color}
              emissiveIntensity={0.25}
              roughness={0.3}
              metalness={0.45}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function NeuralNet({ paused }) {
  const group = useRef(null);
  const { nodes, links } = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 36; i += 1) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          -4 - Math.random() * 18
        )
      );
    }
    const edges = [];
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        if (pts[i].distanceTo(pts[j]) < 4.2 && Math.random() > 0.55) {
          edges.push({
            geo: new THREE.BufferGeometry().setFromPoints([pts[i], pts[j]]),
            color: i % 2 ? TEAL : CORAL,
          });
        }
      }
    }
    return { nodes: pts, links: edges };
  }, []);

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.y += delta * 0.012;
    group.current.rotation.x = Math.sin(performance.now() * 0.0001) * 0.04;
  });

  return (
    <group ref={group}>
      {links.map((link, i) => (
        <line key={`l-${i}`} geometry={link.geo}>
          <lineBasicMaterial color={link.color} transparent opacity={0.22} depthWrite={false} />
        </line>
      ))}
      {nodes.map((p, i) => (
        <mesh key={`n-${i}`} position={p}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? CORAL : TEAL}
            emissive={i % 3 === 0 ? CORAL : TEAL}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function ParticleStream({ paused }) {
  const ref = useRef(null);
  const count = 900;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = -Math.random() * 40;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || paused) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 2; i < pos.length; i += 3) {
      pos[i] += delta * 1.5;
      if (pos[i] > 5) pos[i] = -40;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={SKY}
        size={0.06}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function HorizonGrid({ paused }) {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (!ref.current || paused) return;
    ref.current.position.z = ((performance.now() * 0.00035) % 2) - 1;
  });

  return (
    <group ref={ref} position={[0, -3.6, -8]} rotation={[-Math.PI / 2.15, 0, 0]}>
      <Grid
        args={[40, 40]}
        cellSize={0.8}
        cellThickness={0.7}
        cellColor="#9eb6d4"
        sectionSize={3.2}
        sectionThickness={1.2}
        sectionColor={TEAL}
        fadeDistance={28}
        fadeStrength={1.4}
        infiniteGrid
      />
    </group>
  );
}

function CentralCore({ paused }) {
  const core = useRef(null);
  const ring = useRef(null);

  useFrame((_, delta) => {
    if (paused) return;
    if (core.current) {
      core.current.rotation.y += delta * 0.1;
      core.current.rotation.x += delta * 0.04;
    }
    if (ring.current) {
      ring.current.rotation.z -= delta * 0.12;
      ring.current.rotation.x = Math.sin(performance.now() * 0.00025) * 0.25;
    }
  });

  return (
    <group position={[0, 0.3, -9]}>
      <Float speed={paused ? 0 : 0.6} floatIntensity={paused ? 0 : 0.4} rotationIntensity={0.12}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 1]} />
          <meshStandardMaterial
            color={TEAL}
            wireframe
            transparent
            opacity={0.65}
            emissive={TEAL}
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh scale={0.72}>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial
            color={CORAL}
            transparent
            opacity={0.22}
            emissive={CORAL}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </Float>
      <mesh ref={ring} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.04, 12, 80]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.45}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh rotation={[0.4, 0.6, 0]}>
        <torusGeometry args={[2.7, 0.025, 12, 80]} />
        <meshStandardMaterial color={SKY} emissive={SKY} emissiveIntensity={0.35} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Scene({ paused, mouse }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 42]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} color="#fff8f0" />
      <pointLight position={[-5, 3, -2]} intensity={1.4} color={CORAL} />
      <pointLight position={[5, -2, -6]} intensity={1.2} color={TEAL} />
      <pointLight position={[0, 4, -10]} intensity={1} color={GOLD} />

      <MouseParallax paused={paused} mouse={mouse} />
      <HorizonGrid paused={paused} />
      <RingTunnel paused={paused} />
      <CentralCore paused={paused} />
      <FloatingSolids paused={paused} />
      <NeuralNet paused={paused} />
      <ParticleStream paused={paused} />
      <Sparkles
        count={80}
        scale={[18, 10, 20]}
        size={3}
        speed={paused ? 0 : 0.2}
        opacity={0.55}
        color={GOLD}
      />
    </>
  );
}

export default function SceneBackground() {
  const { motionOn } = useMotionPref();
  const mouse = useRef({ x: 0, y: 0 });
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paused = !motionOn || reduce;

  useEffect(() => {
    if (paused) return undefined;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [paused]);

  return (
    <div className="scene-bg scene-bg--full" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.4, 10], fov: 48, near: 0.1, far: 90 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Scene paused={paused} mouse={mouse} />
      </Canvas>
      <div className="scene-veil" />
    </div>
  );
}
