import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Grid, Sparkles } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { useMotionPref } from '../context/MotionContext';

const TEAL = '#2a9d8f';
const CORAL = '#e76f51';
const GOLD = '#e9a23b';
const SKY = '#5b9fd4';
const BG = '#e8eef8';

const AURORA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AURORA_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform vec2 uMouse;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + 1.7;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
    float t = uTime * 0.06;
    vec2 mouseShift = (uMouse - 0.5) * 0.12;

    float wob1 = fbm(p * 1.7 + vec2(t * 0.35, -t * 0.22));
    float wob2 = fbm(p * 2.1 + vec2(4.1, 2.3) - t * 0.3);
    float grain = fbm(p * 3.4 + vec2(-2.0, 6.0) + t * 0.18);

    vec2 c1 = vec2(-0.52, -0.34 + sin(t * 0.5) * 0.07) + mouseShift;
    vec2 c2 = vec2(0.5, 0.3 + cos(t * 0.42) * 0.06) + mouseShift * 0.6;
    vec2 c3 = vec2(-0.38, 0.42 + sin(t * 0.33) * 0.05);
    vec2 c4 = vec2(0.15, -0.52 + cos(t * 0.37) * 0.06);
    c1.y -= uScroll * 0.32;
    c2.y -= uScroll * 0.22;
    c3.y -= uScroll * 0.26;
    c4.y -= uScroll * 0.18;

    float b1 = exp(-dot(p - c1, p - c1) * 3.4) * (0.7 + wob1 * 0.6);
    float b2 = exp(-dot(p - c2, p - c2) * 3.8) * (0.7 + wob2 * 0.6);
    float b3 = exp(-dot(p - c3, p - c3) * 4.6) * (0.65 + wob1 * 0.55);
    float b4 = exp(-dot(p - c4, p - c4) * 5.2) * (0.6 + wob2 * 0.5);

    vec3 base = vec3(0.947, 0.963, 0.986);
    vec3 sky = vec3(0.36, 0.62, 0.83);
    vec3 teal = vec3(0.165, 0.616, 0.561);
    vec3 coral = vec3(0.906, 0.435, 0.318);
    vec3 gold = vec3(0.914, 0.635, 0.231);

    vec3 col = base;
    col = mix(col, sky, clamp(b3, 0.0, 1.0) * 0.42);
    col = mix(col, teal, clamp(b1, 0.0, 1.0) * 0.46);
    col = mix(col, coral, clamp(b2, 0.0, 1.0) * 0.4);
    col = mix(col, gold, clamp(b4, 0.0, 1.0) * 0.26);

    col += (grain - 0.5) * 0.025;
    float d = length(p * vec2(0.9, 1.0));
    col = mix(col, vec3(0.975, 0.98, 0.992), smoothstep(0.2, 0.78, 1.0 - d) * 0.22);
    col *= 1.0 - 0.06 * smoothstep(0.5, 1.0, d);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraBackdrop({ paused, mouse, scroll }) {
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useEffect(() => {
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
  }, [size, uniforms]);

  useFrame((_, delta) => {
    if (paused) return;
    uniforms.uTime.value += delta;
    uniforms.uScroll.value += (scroll.current - uniforms.uScroll.value) * Math.min(1, delta * 2.5);
    uniforms.uMouse.value.set(mouse.current.x * 0.5 + 0.5, mouse.current.y * 0.5 + 0.5);
  });

  return (
    <mesh position={[0, 0.5, -26]} renderOrder={-100} frustumCulled={false}>
      <planeGeometry args={[72, 46]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={AURORA_VERT}
        fragmentShader={AURORA_FRAG}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function MouseParallax({ paused, mouse, scroll }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.4, 10));

  useFrame((_, delta) => {
    if (paused) return;
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const s = scroll.current;
    target.current.x = mx * 1.4;
    target.current.y = 0.35 + my * 0.7 + s * 1.5;
    target.current.z = 10 - s * 1.3;
    camera.position.lerp(target.current, 1 - Math.exp(-1.2 * delta));
    camera.lookAt(mx * 0.35, 0.2 + my * 0.2 + s * 0.55, -6);
  });

  return null;
}

function RingTunnel({ paused, scroll }) {
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
    group.current.rotation.z = Math.sin(performance.now() * 0.00008) * 0.05 + scroll.current * 0.22;
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
            opacity={0.45}
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

  useEffect(
    () => () => {
      links.forEach((link) => link.geo.dispose());
    },
    [links]
  );

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

function ParticleStream({ paused, compact }) {
  const ref = useRef(null);
  const count = compact ? 320 : 900;
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
  useFrame(() => {
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

function CoreGlow({ paused }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current || paused) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.45) * 0.04;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group position={[0, 0.3, -10.2]}>
      <mesh ref={ref} renderOrder={-1}>
        <planeGeometry args={[7.4, 7.4]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uColor: { value: new THREE.Color(TEAL) } }}
          vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
          fragmentShader="varying vec2 vUv; uniform vec3 uColor; void main() { float d = length(vUv - 0.5) * 2.0; float a = exp(-d * d * 3.2) * 0.22; gl_FragColor = vec4(uColor, a); }"
        />
      </mesh>
      <mesh position={[0.5, -0.2, -0.2]}>
        <planeGeometry args={[4.6, 4.6]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uColor: { value: new THREE.Color(CORAL) } }}
          vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
          fragmentShader="varying vec2 vUv; uniform vec3 uColor; void main() { float d = length(vUv - 0.5) * 2.0; float a = exp(-d * d * 3.6) * 0.14; gl_FragColor = vec4(uColor, a); }"
        />
      </mesh>
    </group>
  );
}

function Orbitals({ paused }) {
  const group = useRef(null);
  const items = useMemo(
    () => [
      { r: 1.75, speed: 0.5, size: 0.07, color: TEAL, phase: 0 },
      { r: 2.05, speed: -0.34, size: 0.06, color: CORAL, phase: 1.9 },
      { r: 2.45, speed: 0.26, size: 0.05, color: GOLD, phase: 3.7 },
      { r: 2.8, speed: -0.22, size: 0.045, color: SKY, phase: 5.1 },
      { r: 2.3, speed: 0.4, size: 0.055, color: TEAL, phase: 2.8 },
      { r: 2.62, speed: -0.3, size: 0.05, color: CORAL, phase: 4.4 },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.children.forEach((node) => {
      const d = node.userData;
      d.a += delta * d.speed;
      node.position.set(Math.cos(d.a) * d.r, Math.sin(d.a * 1.35) * 0.5, Math.sin(d.a) * d.r * 0.5);
    });
  });

  return (
    <group ref={group} position={[0, 0.3, -9]}>
      {items.map((item, i) => (
        <mesh key={i} userData={{ ...item, a: item.phase }} scale={item.size}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={1.6} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ paused, mouse, scroll, compact }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 42]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} color="#fff8f0" />
      <pointLight position={[-5, 3, -2]} intensity={1.4} color={CORAL} />
      <pointLight position={[5, -2, -6]} intensity={1.2} color={TEAL} />
      {!compact && <pointLight position={[0, 4, -10]} intensity={1} color={GOLD} />}

      <AuroraBackdrop paused={paused} mouse={mouse} scroll={scroll} />
      {!compact && <MouseParallax paused={paused} mouse={mouse} scroll={scroll} />}
      <HorizonGrid paused={paused} />
      <RingTunnel paused={paused} scroll={scroll} />
      <CoreGlow paused={paused} />
      <CentralCore paused={paused} />
      <Orbitals paused={paused} />
      {!compact && <FloatingSolids paused={paused} />}
      {!compact && <NeuralNet paused={paused} />}
      <ParticleStream paused={paused} compact={compact} />
      <Sparkles
        count={compact ? 36 : 80}
        scale={[18, 10, 20]}
        size={compact ? 2 : 3}
        speed={paused ? 0 : 0.2}
        opacity={0.55}
        color={GOLD}
      />
    </>
  );
}

function useIsCompact() {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const onChange = () => setCompact(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return compact;
}

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneBackground() {
  const { motionOn } = useMotionPref();
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const compact = useIsCompact();
  const reduce = useReducedMotion();
  const paused = !motionOn || Boolean(reduce);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (paused || compact) return undefined;
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [paused, compact]);

  return (
    <div className="scene-bg scene-bg--full" aria-hidden>
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 0.4, 10], fov: compact ? 52 : 48, near: 0.1, far: 90 }}
          dpr={compact ? [1, 1.25] : [1, 1.5]}
          frameloop={paused ? 'demand' : 'always'}
          gl={{ antialias: !compact, alpha: false, powerPreference: 'high-performance' }}
        >
          <Scene paused={paused} mouse={mouse} scroll={scroll} compact={compact} />
        </Canvas>
      </SceneBoundary>
      <div className="scene-veil" />
    </div>
  );
}
