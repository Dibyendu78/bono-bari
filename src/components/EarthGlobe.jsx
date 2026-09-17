import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './EarthGlobe.css';

/**
 * EarthGlobe — Authentic Google Earth style 3D interactive globe.
 * Features seamless in-place zoom straight into Jhargram, West Bengal (22.3752° N, 87.0223° E).
 * Zero external tile maps — 100% pure Three.js GPU accelerated celestial flight.
 */
export default function EarthGlobe({
  stage = 'HERO', // 'HERO' | 'ZOOMING' | 'ARRIVED' | 'REVERSING'
  onZoomComplete,
  onReverseComplete,
  onTelemetry,
  language = 'en'
}) {
  const mountRef = useRef(null);
  const pinOverlayRef = useRef(null);

  // Keep fresh prop refs for the animation loop
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const onZoomCompleteRef = useRef(onZoomComplete);
  onZoomCompleteRef.current = onZoomComplete;

  const onReverseCompleteRef = useRef(onReverseComplete);
  onReverseCompleteRef.current = onReverseComplete;

  const onTelemetryRef = useRef(onTelemetry);
  onTelemetryRef.current = onTelemetry;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // ── 1. Scene, Camera & Renderer ──────────────────────────────────────
    const scene = new THREE.Scene();

    // Camera at z=5.0 gives grand orbital view; zooms into z=1.74 for Jhargram
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 500);
    camera.position.set(0, 0, 5.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'earth-canvas';
    container.appendChild(renderer.domElement);

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    // ── 2. Directional Sun & Ambient Lighting ─────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0e1726, 0.95);
    scene.add(ambientLight);

    // Warm Sun from upper-right
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.6);
    sunLight.position.set(7.0, 3.8, 5.0);
    scene.add(sunLight);

    // Space blue rim fill on dark side
    const rimFillLight = new THREE.DirectionalLight(0x204474, 0.7);
    rimFillLight.position.set(-6.5, -2.5, -4.5);
    scene.add(rimFillLight);

    // ── 3. Starry Cosmos ──────────────────────────────────────────────────
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const r = 40 + Math.random() * 50;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const isBlue = Math.random() > 0.35;
      starColors[i * 3] = isBlue ? 0.78 : 1.0;
      starColors[i * 3 + 1] = isBlue ? 0.88 : 0.95;
      starColors[i * 3 + 2] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starCanvas = document.createElement('canvas');
    starCanvas.width = starCanvas.height = 32;
    const starCtx = starCanvas.getContext('2d');
    const grad = starCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(180,220,255,0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    starCtx.fillStyle = grad;
    starCtx.beginPath();
    starCtx.arc(16, 16, 16, 0, Math.PI * 2);
    starCtx.fill();
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMat = new THREE.PointsMaterial({
      map: starTexture,
      size: 0.42,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── 4. Earth Globe Group (Radius 1.46) ─────────────────────────────────
    const EARTH_R = 1.46;
    const earthGroup = new THREE.Group();
    // Default angles: upright North Pole, India and Bay of Bengal centered
    let rotX = -0.22;
    let rotY = -2.95;
    earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));
    scene.add(earthGroup);

    // ── 5. Textures ───────────────────────────────────────────────────────
    const texLoader = new THREE.TextureLoader();

    const dayTexture = texLoader.load('/textures/earth_day_4096.jpg');
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = maxAnisotropy;

    const specTexture = texLoader.load('/textures/earth_specular_2048.jpg');
    specTexture.anisotropy = maxAnisotropy;

    const normTexture = texLoader.load('/textures/earth_normal_2048.jpg');
    normTexture.anisotropy = maxAnisotropy;

    const cloudsTexture = texLoader.load('/textures/earth_clouds_1024.png');
    cloudsTexture.anisotropy = maxAnisotropy;

    // ── 6. Earth Surface Mesh (Matte Ocean & Crisp Continents) ────────────
    const earthGeo = new THREE.SphereGeometry(EARTH_R, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: dayTexture,
      normalMap: normTexture,
      normalScale: new THREE.Vector2(0.16, 0.16),
      roughnessMap: specTexture,
      roughness: 0.62,
      metalness: 0.02
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // ── 7. Cloud Layer ────────────────────────────────────────────────────
    const cloudGeo = new THREE.SphereGeometry(EARTH_R * 1.012, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.44,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      roughness: 1.0
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // ── 8. 3D Beacon at Jhargram, West Bengal (22.3752° N, 87.0223° E) ────
    // Jhargram coordinates mapped onto sphere surface
    const jhargramUnit = new THREE.Vector3(0.074937, 0.593845, -1.440601).normalize();
    const markerPos = jhargramUnit.clone().multiplyScalar(EARTH_R * 1.002);

    const markerGroup = new THREE.Group();
    markerGroup.position.copy(markerPos);

    // Align marker with sphere surface normal
    const surfaceNormal = jhargramUnit.clone();
    markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfaceNormal);

    // 1. Glowing central core sphere
    const coreGeo = new THREE.SphereGeometry(0.014, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    markerGroup.add(coreMesh);

    // 2. Inner pulsating radar wave
    const ring1Geo = new THREE.RingGeometry(0.018, 0.026, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    markerGroup.add(ring1);

    // 3. Outer expanding radar ring
    const ring2Geo = new THREE.RingGeometry(0.03, 0.04, 32);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    markerGroup.add(ring2);

    // 4. Vertical beacon pin beam
    const beamGeo = new THREE.CylinderGeometry(0.0025, 0.0025, 0.12, 12);
    beamGeo.translate(0, 0.06, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.rotation.x = Math.PI / 2;
    markerGroup.add(beamMesh);

    earthGroup.add(markerGroup);

    // ── 9. Interactive Drag Rotation (Only when finger touches Earth sphere) ──
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const isTouchOnEarth = (clientX, clientY) => {
      if (!renderer || !renderer.domElement) return false;
      const rect = renderer.domElement.getBoundingClientRect();
      if (
        clientX < rect.left || clientX > rect.right ||
        clientY < rect.top || clientY > rect.bottom
      ) {
        return false;
      }
      mouseCoord.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseCoord, camera);
      const hits = raycaster.intersectObject(earthMesh, false);
      return hits.length > 0;
    };

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    // Desktop Mouse Drag Handler (Only initiates when clicking directly on Earth sphere)
    const onMouseDown = (e) => {
      if (stageRef.current === 'ZOOMING') return;
      if (e.button !== 0) return; // Left click only

      if (!isTouchOnEarth(e.clientX, e.clientY)) {
        isDragging = false;
        return;
      }

      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      const factor = stageRef.current === 'ARRIVED' ? 0.001 : 0.0035;
      velY = deltaX * factor;
      velX = deltaY * (factor * 0.7);

      rotY += velY;
      rotX = Math.max(-0.55, Math.min(0.55, rotX - velX));
      earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile / Touch Drag Handler (STRICT: Only when finger is directly on the Earth sphere)
    const onTouchStart = (e) => {
      if (stageRef.current === 'ZOOMING') return;
      const touch = e.touches && e.touches[0];
      if (!touch) return;

      // STRICT RAYCAST CHECK:
      // If finger is outside the 3D Earth sphere -> unblock native vertical page scroll 100%!
      if (!isTouchOnEarth(touch.clientX, touch.clientY)) {
        isDragging = false;
        return;
      }

      // Finger is directly ON the Earth sphere -> lock scroll and spin Earth
      isDragging = true;
      prevX = touch.clientX;
      prevY = touch.clientY;
      velX = 0;
      velY = 0;
    };

    const onTouchMove = (e) => {
      // If finger was outside Earth, DO NOT prevent default -> Browser scrolls page smoothly!
      if (!isDragging) return;

      const touch = e.touches && e.touches[0];
      if (!touch) return;

      if (e.cancelable) {
        e.preventDefault(); // Only lock scroll while finger is actively rotating the 3D Earth
      }

      const deltaX = touch.clientX - prevX;
      const deltaY = touch.clientY - prevY;
      prevX = touch.clientX;
      prevY = touch.clientY;

      const factor = stageRef.current === 'ARRIVED' ? 0.001 : 0.0035;
      velY = deltaX * factor;
      velX = deltaY * (factor * 0.7);

      rotY += velY;
      rotX = Math.max(-0.55, Math.min(0.55, rotX - velX));
      earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Attach Mouse Listeners
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Attach Touch Listeners (touchmove must be non-passive to cancel scroll ONLY when on Earth)
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    // ── 10. Resize Observer ───────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ── 11. Animation & Zoom Engine ───────────────────────────────────────
    let animId;
    const clock = new THREE.Clock();

    // Target angles for Jhargram facing the camera directly with North Pole upright:
    const JHARGRAM_ROTX = -0.3908;
    const JHARGRAM_ROTY = -3.0916;
    const CLOSE_CAM_Z = 3.3;
    const ORBIT_CAM_Z = 5.0;

    let prevStage = stageRef.current;
    let zoomStartTime = 0;
    let zoomStartRotX = rotX;
    let zoomStartRotY = rotY;
    let zoomStartCamZ = ORBIT_CAM_Z;
    let zoomTargetRotY = JHARGRAM_ROTY;
    let zoomCompleted = false;

    let reverseStartTime = 0;
    let reverseStartCamZ = CLOSE_CAM_Z;
    let reverseCompleted = false;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const currentStage = stageRef.current;

      // Detect stage transitions
      if (currentStage !== prevStage) {
        if (currentStage === 'ZOOMING') {
          zoomStartTime = clock.getElapsedTime();
          zoomStartRotX = rotX;
          zoomStartRotY = rotY;
          zoomStartCamZ = camera.position.z;
          zoomCompleted = false;

          // Compute shortest angular path for rotY to avoid multiple full spins
          const diffY = ((JHARGRAM_ROTY - zoomStartRotY + Math.PI) % (2 * Math.PI)) - Math.PI;
          zoomTargetRotY = zoomStartRotY + diffY;
        } else if (currentStage === 'REVERSING') {
          reverseStartTime = clock.getElapsedTime();
          reverseStartCamZ = camera.position.z;
          reverseCompleted = false;
        }
        prevStage = currentStage;
      }

      // ── Stage A: ZOOMING DIVE ──────────────────────────────────────────
      if (currentStage === 'ZOOMING') {
        const DURATION = 2.6; // 2.6s cinematic dive
        const elapsed = clock.getElapsedTime() - zoomStartTime;
        const rawT = Math.min(1.0, elapsed / DURATION);
        // Smooth cubic ease-in-out
        const ease = rawT < 0.5
          ? 4 * rawT * rawT * rawT
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        rotX = THREE.MathUtils.lerp(zoomStartRotX, JHARGRAM_ROTX, ease);
        rotY = THREE.MathUtils.lerp(zoomStartRotY, zoomTargetRotY, ease);
        earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));

        camera.position.z = THREE.MathUtils.lerp(zoomStartCamZ, CLOSE_CAM_Z, ease);

        // Telemetry flight reporting
        if (onTelemetryRef.current) {
          const alt = Math.round(THREE.MathUtils.lerp(12800, 120, ease));
          let sector = 'PLANET EARTH ORBIT';
          if (rawT > 0.8) sector = 'JHARGRAM SAL FOREST';
          else if (rawT > 0.5) sector = 'BENGAL DELTA CANOPY';
          else if (rawT > 0.25) sector = 'INDIAN SUBCONTINENT';

          onTelemetryRef.current({
            progress: ease,
            altitude: alt,
            sector,
            lat: 22.3752,
            lon: 87.0223
          });
        }

        if (rawT >= 1.0 && !zoomCompleted) {
          zoomCompleted = true;
          if (onZoomCompleteRef.current) onZoomCompleteRef.current();
        }
      }
      // ── Stage B: ARRIVED IN JHARGRAM ──────────────────────────────────
      else if (currentStage === 'ARRIVED') {
        if (!isDragging) {
          // Gentle micro atmospheric breathing sway
          const sway = Math.sin(clock.getElapsedTime() * 0.8) * 0.003;
          camera.position.z = CLOSE_CAM_Z + sway;
          velX *= 0.94;
          velY *= 0.94;
        }
      }
      // ── Stage C: REVERSING TO SPACE ORBIT ─────────────────────────────
      else if (currentStage === 'REVERSING') {
        const REVERSE_DURATION = 1.8;
        const elapsed = clock.getElapsedTime() - reverseStartTime;
        const rawT = Math.min(1.0, elapsed / REVERSE_DURATION);
        const ease = 1 - Math.pow(1 - rawT, 3); // ease-out cubic

        camera.position.z = THREE.MathUtils.lerp(reverseStartCamZ, ORBIT_CAM_Z, ease);

        // Resume gentle spin
        rotY += delta * 0.016;
        earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));

        if (rawT >= 1.0 && !reverseCompleted) {
          reverseCompleted = true;
          if (onReverseCompleteRef.current) onReverseCompleteRef.current();
        }
      }
      // ── Stage D: HERO (DEFAULT ORBIT) ─────────────────────────────────
      else {
        if (!isDragging) {
          rotY += velY + delta * 0.016; // gentle auto-rotation
          rotX = Math.max(-0.55, Math.min(0.55, rotX + velX));
          velX *= 0.94;
          velY *= 0.94;
          earthGroup.quaternion.setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'));
        }
        camera.position.z = ORBIT_CAM_Z;
      }

      // Cloud spin
      cloudMesh.rotation.y += delta * 0.01;

      // ── Pulsing Radar Waves at Jhargram ────────────────────────────────
      const time = clock.getElapsedTime();
      const isExploringStage = currentStage === 'ZOOMING' || currentStage === 'ARRIVED';
      const maxOp1 = isExploringStage ? 0.95 : 0.4;
      const maxOp2 = isExploringStage ? 0.8 : 0.25;

      const wave1 = 1 + ((time * 1.8) % 2.5);
      ring1.scale.set(wave1, wave1, 1);
      ring1Mat.opacity = Math.max(0, maxOp1 * (1 - (wave1 - 1) / 2.5));

      const wave2 = 1 + (((time * 1.8) + 1.25) % 2.5);
      ring2.scale.set(wave2, wave2, 1);
      ring2Mat.opacity = Math.max(0, maxOp2 * (1 - (wave2 - 1) / 2.5));

      renderer.render(scene, camera);
    };

    animate();

    // ── 12. Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="earth-globe-wrapper" ref={mountRef} />
  );
}
