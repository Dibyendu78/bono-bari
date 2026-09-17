import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Exact coordinates for Bono Bari Eco Resort (Jangal Khas, Jhargram, West Bengal)
const TARGET_LAT = 22.3752;
const TARGET_LON = 87.0223;
const EARTH_RADIUS = 2.2;

// Helper to construct a quaternion that places (lat, lon) directly in front of the camera (0, 0, 1)
// while GUARANTEEING that the North Pole points strictly UP (+Y)
function makeUprightQuaternion(lat, lon) {
  const latR = lat * (Math.PI / 180);
  const lonR = (lon + 180) * (Math.PI / 180);
  const vx = -Math.cos(latR) * Math.cos(lonR);
  const vy = Math.sin(latR);
  const vz = Math.cos(latR) * Math.sin(lonR);
  const rotY = -Math.atan2(vx, vz);
  const rotX = -latR;
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));
}

export default function EarthCanvas({
  stage, // 'HERO' | 'ZOOMING' | 'ARRIVED' | 'REVERSING'
  scrollProgress = 0, // 0 = Hero horizon view, 1 = Whole Earth view
  onTelemetryUpdate,
  onEnterAtmosphere,
  onReverseComplete
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    stage: 'HERO',
    scrollProgress: 0,
    currentScroll: 0,
    zoomProgress: 0,
    reverseProgress: 0,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    velX: 0,
    velY: 0,
    // Initial upright angles: India & Bay of Bengal centered facing camera
    userRotX: -0.28,
    userRotY: -2.98,
    startEarthY: 0,
    startCamZ: 0,
    zoomStartQuaternion: new THREE.Quaternion(),
    reverseStartQuaternion: new THREE.Quaternion(),
    targetQuaternion: new THREE.Quaternion(),
    hasCapturedZoomStart: false,
    hasCapturedReverseStart: false,
    hasSentAtmosphereEntry: false
  });

  // Keep stateRef synced
  useEffect(() => {
    stateRef.current.stage = stage;
    if (stage === 'ZOOMING') {
      stateRef.current.zoomProgress = 0;
      stateRef.current.hasCapturedZoomStart = false;
      stateRef.current.hasSentAtmosphereEntry = false;
    }
    if (stage === 'REVERSING') {
      stateRef.current.reverseProgress = 0;
      stateRef.current.hasCapturedReverseStart = false;
    }
  }, [stage]);

  useEffect(() => {
    stateRef.current.scrollProgress = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.05, 1000);

    const getCamZHero = () => (container.clientWidth < 600 ? 4.8 : 4.2);
    const getEarthYHero = () => (container.clientWidth < 600 ? -1.5 : -1.95);
    const CAM_Z_WHOLE = 5.8;
    const EARTH_Y_WHOLE = 0.0;
    const CAM_Z_APPROACH = 2.95; // Descends close to India before satellite handoff

    camera.position.set(0, 0, getCamZHero());

    // RENDERER - Crystal clear output settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x243548, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(7, 4, 6);
    scene.add(sunLight);

    const rimBlue = new THREE.DirectionalLight(0x79dce8, 1.2);
    rimBlue.position.set(-6, -2, -4);
    scene.add(rimBlue);

    // CELESTIAL STARFIELD WITH CRYSTAL ROUND GLOWING STARS
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(180, 230, 255, 0.85)');
      grad.addColorStop(0.6, 'rgba(121, 220, 232, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const starsCount = 2000;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 35.0 + Math.random() * 55.0;
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      map: createStarTexture(),
      size: 0.65,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // EARTH GROUP (Always kept upright with North Pole UP)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, getEarthYHero(), 0);
    scene.add(earthGroup);

    // Set initial upright rotation
    earthGroup.quaternion.setFromEuler(
      new THREE.Euler(stateRef.current.userRotX, stateRef.current.userRotY, 0, 'YXZ')
    );

    // TEXTURE LOADER - 4K Ultra-HD Crystal Textures
    const textureLoader = new THREE.TextureLoader();

    // 4K Day Map with high-res anisotropic filtering
    const earthMap = textureLoader.load('/textures/earth_day_4096.jpg');
    earthMap.colorSpace = THREE.SRGBColorSpace;
    earthMap.anisotropy = maxAnisotropy;
    earthMap.minFilter = THREE.LinearMipmapLinearFilter;
    earthMap.magFilter = THREE.LinearFilter;

    // Specular map for gleaming crystal oceans
    const earthSpecular = textureLoader.load('/textures/earth_specular_2048.jpg');
    earthSpecular.anisotropy = maxAnisotropy;

    // Subtle normal map for mountain terrain relief
    const earthNormal = textureLoader.load('/textures/earth_normal_2048.jpg');
    earthNormal.anisotropy = maxAnisotropy;

    // Clouds
    const earthClouds = textureLoader.load('/textures/earth_clouds_1024.png');
    earthClouds.anisotropy = maxAnisotropy;

    // 1. CRYSTAL CLEAR EARTH SURFACE MESH
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthMap,
      normalMap: earthNormal,
      normalScale: new THREE.Vector2(0.18, 0.18),
      roughnessMap: earthSpecular,
      roughness: 0.65,
      metalness: 0.08
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 2. TRANSLUCENT CLOUD LAYER
    const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.011, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: earthClouds,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      roughness: 1.0
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 3. CRYSTAL ATMOSPHERE GLOW SHADER
    const atmoGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.14, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 3.2);
          gl_FragColor = vec4(0.28, 0.76, 0.98, 1.0) * intensity * 2.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);

    // 4. JHARGRAM BEACON AT LAT/LON
    const getSurfaceVector = (lat, lon) => {
      const latitude = lat * (Math.PI / 180);
      const longitude = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -Math.cos(latitude) * Math.cos(longitude) * EARTH_RADIUS,
        Math.sin(latitude) * EARTH_RADIUS,
        Math.cos(latitude) * Math.sin(longitude) * EARTH_RADIUS
      );
    };

    const targetVec = getSurfaceVector(TARGET_LAT, TARGET_LON);

    // Target quaternion guarantees North Pole points UP (+Y)
    stateRef.current.targetQuaternion.copy(makeUprightQuaternion(TARGET_LAT, TARGET_LON));

    // MARKER GROUP
    const markerGroup = new THREE.Group();
    markerGroup.position.copy(targetVec);
    markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetVec.clone().normalize());

    // Glowing core
    const pinCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    markerGroup.add(pinCore);

    // Expanding pulsing radar rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x79dce8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.035, 0.065, 32), ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    markerGroup.add(ringMesh);

    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x5fd0e1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const outerRingMesh = new THREE.Mesh(new THREE.RingGeometry(0.065, 0.095, 32), outerRingMat);
    outerRingMesh.rotation.x = Math.PI / 2;
    markerGroup.add(outerRingMesh);

    // Stem
    const stemMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.08, 8),
      new THREE.MeshBasicMaterial({ color: 0x79dce8 })
    );
    stemMesh.position.y = 0.04;
    markerGroup.add(stemMesh);

    earthGroup.add(markerGroup);

    // DRAG ROTATION: North Pole is strictly protected from ever flipping upside down
    const onPointerDown = (e) => {
      if (stateRef.current.stage !== 'HERO') return;
      if (e.target.closest('button, a, .hud-panel, .resort-card, .leaflet-container')) return;

      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
      stateRef.current.velX = 0;
      stateRef.current.velY = 0;
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.isDragging || stateRef.current.stage !== 'HERO') return;
      const deltaX = e.clientX - stateRef.current.prevMouseX;
      const deltaY = e.clientY - stateRef.current.prevMouseY;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;

      stateRef.current.velY = deltaX * 0.004;
      stateRef.current.velX = deltaY * 0.003;

      // Horizontal drag spins the Earth East/West naturally around its polar axis
      stateRef.current.userRotY += deltaX * 0.004;
      // Vertical drag tilts latitude smoothly, clamped so North NEVER points down
      stateRef.current.userRotX = Math.max(-0.55, Math.min(0.55, stateRef.current.userRotX - deltaY * 0.003));
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // RESIZE
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Smooth continuous flight easing (no sudden zero-velocity stops)
    const smoothFlightEase = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Cloud slow majestic drift
      cloudMesh.rotation.y += delta * 0.01;

      // Pulse beacon rings
      const pulse1 = 1.0 + 0.6 * Math.sin(elapsedTime * 4.0);
      ringMesh.scale.set(pulse1, pulse1, pulse1);
      ringMat.opacity = Math.max(0, 0.85 - 0.5 * pulse1);

      const pulse2 = 1.0 + 0.8 * Math.sin(elapsedTime * 4.0 - 0.8);
      outerRingMesh.scale.set(pulse2, pulse2, pulse2);
      outerRingMat.opacity = Math.max(0, 0.65 - 0.45 * pulse2);

      const currentState = stateRef.current.stage;

      if (currentState === 'HERO') {
        // Interpolate scroll progress
        const targetScroll = stateRef.current.scrollProgress;
        stateRef.current.currentScroll += (targetScroll - stateRef.current.currentScroll) * 0.08;
        const sp = stateRef.current.currentScroll;

        // Apply drag inertia and gentle natural spin
        if (!stateRef.current.isDragging) {
          stateRef.current.userRotY += stateRef.current.velY + delta * 0.022;
          stateRef.current.userRotX = Math.max(-0.55, Math.min(0.55, stateRef.current.userRotX + stateRef.current.velX));
          stateRef.current.velX *= 0.94;
          stateRef.current.velY *= 0.94;
        }

        // Apply upright orientation with Euler 'YXZ' (North Pole is always UP)
        earthGroup.quaternion.setFromEuler(
          new THREE.Euler(stateRef.current.userRotX, stateRef.current.userRotY, 0, 'YXZ')
        );

        // Smooth transition between Hero Horizon View and Whole Earth View
        const yHero = getEarthYHero();
        const curEarthY = yHero + (EARTH_Y_WHOLE - yHero) * sp;
        earthGroup.position.set(0, curEarthY, 0);

        const zHero = getCamZHero();
        const curCamZ = zHero + (CAM_Z_WHOLE - zHero) * sp;
        camera.position.set(0, 0, curCamZ);

        // Snapshot position for zoom initiation
        stateRef.current.startEarthY = curEarthY;
        stateRef.current.startCamZ = curCamZ;
      } else if (currentState === 'ZOOMING') {
        // Phase 1: 3D Earth space descent focusing into India (takes ~1.8s)
        if (!stateRef.current.hasCapturedZoomStart) {
          stateRef.current.zoomStartQuaternion.copy(earthGroup.quaternion);
          stateRef.current.hasCapturedZoomStart = true;
        }

        const zoomSpeed = 0.55; // ~1.8s smooth descent
        stateRef.current.zoomProgress = Math.min(1.0, stateRef.current.zoomProgress + delta * zoomSpeed);
        const p = stateRef.current.zoomProgress;
        const eased = smoothFlightEase(p);

        // Center the globe smoothly
        const startY = stateRef.current.startEarthY;
        earthGroup.position.y = startY + (0 - startY) * eased;

        // Rotate upright to center India in view
        earthGroup.quaternion.slerpQuaternions(
          stateRef.current.zoomStartQuaternion,
          stateRef.current.targetQuaternion,
          eased
        );

        // Camera plunges towards India
        const startZ = stateRef.current.startCamZ;
        const currentCamDist = startZ + (CAM_Z_APPROACH - startZ) * eased;
        camera.position.set(0, 0, currentCamDist);

        // Telemetry during space descent
        const altKm = Math.round(12800 - p * (12800 - 1800));
        let sector = p > 0.45 ? 'INDIAN SUBCONTINENT' : 'PLANET EARTH ORBIT';


        // Only update telemetry while in 3D Earth space phase
        if (onTelemetryUpdate) {
          onTelemetryUpdate({
            progress: p * 0.35,
            altitude: altKm,
            sector,
            lat: TARGET_LAT,
            lon: TARGET_LON
          });
        }
        // Note: satellite flyTo starts independently from App.jsx — no handoff callback needed

      } else if (currentState === 'REVERSING') {
        // Reverse back to space
        if (!stateRef.current.hasCapturedReverseStart) {
          stateRef.current.reverseStartQuaternion.copy(earthGroup.quaternion);
          stateRef.current.hasCapturedReverseStart = true;
        }

        const revSpeed = 0.55;
        stateRef.current.reverseProgress = Math.min(1.0, stateRef.current.reverseProgress + delta * revSpeed);
        const p = stateRef.current.reverseProgress;
        const eased = smoothFlightEase(p);

        const zTarget = stateRef.current.scrollProgress > 0.5 ? CAM_Z_WHOLE : getCamZHero();
        camera.position.z = CAM_Z_APPROACH + (zTarget - CAM_Z_APPROACH) * eased;

        const yTarget = stateRef.current.scrollProgress > 0.5 ? EARTH_Y_WHOLE : getEarthYHero();
        earthGroup.position.y = 0 + (yTarget - 0) * eased;

        earthGroup.quaternion.slerpQuaternions(
          stateRef.current.reverseStartQuaternion,
          stateRef.current.zoomStartQuaternion,
          eased
        );

        if (p >= 1.0) {
          stateRef.current.reverseProgress = 0;
          stateRef.current.stage = 'HERO';
          if (onReverseComplete) onReverseComplete();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="canvas-container"
      style={{
        cursor: stage === 'HERO' ? 'grab' : 'default',
        zIndex: 1,
        // Smoothly fade out the 3D canvas while the satellite is fading in.
        // The 1.8s delay lets the globe do its initial India-rotation before
        // the satellite map becomes the dominant layer.
        opacity: (stage === 'ZOOMING' || stage === 'ARRIVED') ? 0 : 1,
        transition: stage === 'ZOOMING'
          ? 'opacity 2.0s 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          : stage === 'HERO' || stage === 'REVERSING'
            ? 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
      }}
    />
  );
}
