/**
 * HackSetu 2.0 — Interactive 3D Holographic Cyber Core
 * 
 * 100% Zero-Dependency, Hardware-Accelerated 3D Engine
 * Projects a multi-layered rotating 3D Cyber Icosahedron,
 * Gyroscopic Orbital Rings, and a dynamic 3D Particle Constellation.
 * 
 * Interactivity: Fluid mouse-tracking 3D perspective tilt with spring damping.
 * Strict Palette: Electric Cyber-Amber, Molten Gold, and Titanium Silver (0% Blue, Purple, Green).
 */

(function () {
  'use strict';

  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Accessibility check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dimensions
  let width = 0;
  let height = 0;
  let dpr = 1;
  let centerX = 0;
  let centerY = 0;
  let isVisible = true;

  // 3D Engine Settings
  const FOV = 420;
  let targetRotX = 0.2;
  let targetRotY = 0.3;
  let currentRotX = 0.2;
  let currentRotY = 0.3;
  let autoRotY = 0;
  let autoRotX = 0;

  // ─── 1. Build 3D Geometries ───

  // Icosahedron Golden Ratio constant
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawIcoVertices = [
    [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
    [0, -1,  phi], [0,  1,  phi], [0, -1, -phi], [0,  1, -phi],
    [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
  ];

  // Scale vertices
  const ICO_SCALE = 95;
  const icoVertices = rawIcoVertices.map(([x, y, z]) => {
    const len = Math.sqrt(x * x + y * y + z * z);
    return [ (x / len) * ICO_SCALE, (y / len) * ICO_SCALE, (z / len) * ICO_SCALE ];
  });

  // Icosahedron edges (connecting pairs with distance = 2 in normalized coords)
  const icoEdges = [];
  for (let i = 0; i < icoVertices.length; i++) {
    for (let j = i + 1; j < icoVertices.length; j++) {
      const dx = rawIcoVertices[i][0] - rawIcoVertices[j][0];
      const dy = rawIcoVertices[i][1] - rawIcoVertices[j][1];
      const dz = rawIcoVertices[i][2] - rawIcoVertices[j][2];
      const distSq = dx * dx + dy * dy + dz * dz;
      // Golden ratio distance between adjacent vertices is 4
      if (Math.abs(distSq - 4) < 0.1) {
        icoEdges.push([i, j]);
      }
    }
  }

  // ─── 2. Gyroscopic Orbital Rings ───
  const RING_COUNT = 3;
  const RING_RADIUS = 150;
  const RING_POINTS = 48;
  const rings = [];

  for (let r = 0; r < RING_COUNT; r++) {
    const pts = [];
    const rad = RING_RADIUS + r * 28;
    for (let i = 0; i < RING_POINTS; i++) {
      const theta = (i / RING_POINTS) * Math.PI * 2;
      pts.push({
        x: Math.cos(theta) * rad,
        y: Math.sin(theta) * rad,
        z: 0
      });
    }
    rings.push({
      points: pts,
      axisAngleX: (r * Math.PI) / 3,
      axisAngleY: (r * Math.PI) / 4,
      speed: 0.008 * (r % 2 === 0 ? 1 : -1)
    });
  }

  // ─── 3. Floating 3D Particle Constellation ───
  const PARTICLE_COUNT = 64;
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phiAngle = Math.acos(2.0 * v - 1.0);
    const r = 110 + Math.random() * 110;
    particles.push({
      x: r * Math.sin(phiAngle) * Math.cos(theta),
      y: r * Math.sin(phiAngle) * Math.sin(theta),
      z: r * Math.cos(phiAngle),
      size: 1.2 + Math.random() * 1.8,
      speed: 0.003 + Math.random() * 0.004,
      phase: Math.random() * Math.PI * 2
    });
  }

  // ─── 3D Projection Math ───
  function project(x, y, z, rotX, rotY, rotZ = 0) {
    // Rotate Y
    let cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    let x1 = x * cosY + z * sinY;
    let z1 = -x * sinY + z * cosY;
    let y1 = y;

    // Rotate X
    let cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    let y2 = y1 * cosX - z1 * sinX;
    let z2 = y1 * sinX + z1 * cosX;
    let x2 = x1;

    // Rotate Z
    if (rotZ !== 0) {
      let cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);
      let x3 = x2 * cosZ - y2 * sinZ;
      let y3 = x2 * sinZ + y2 * cosZ;
      x2 = x3;
      y2 = y3;
    }

    // Perspective Division
    const distance = FOV + z2;
    const scale = distance > 10 ? FOV / distance : 0;
    return {
      x: x2 * scale + centerX,
      y: y2 * scale + centerY,
      scale: scale,
      z: z2
    };
  }

  // ─── Canvas Resize ───
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || 480;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    centerX = width / 2;
    centerY = height / 2;
  }

  // ─── Render Loop ───
  function render(time) {
    if (!isVisible) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Damped mouse tracking
    if (!prefersReducedMotion) {
      currentRotX += (targetRotX - currentRotX) * 0.055;
      currentRotY += (targetRotY - currentRotY) * 0.055;
      autoRotY += 0.0075;
      autoRotX = Math.sin(time * 0.001) * 0.15;
    }

    const totalRotX = currentRotX + autoRotX;
    const totalRotY = currentRotY + autoRotY;

    // 1. Draw Atmospheric Amber Glow Core behind 3D shape
    const coreGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 220);
    coreGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
    coreGlow.addColorStop(0.45, 'rgba(217, 119, 6, 0.08)');
    coreGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Render 3D Gyroscopic Rings
    rings.forEach((ring, idx) => {
      const ringRotZ = time * ring.speed;
      const projPoints = ring.points.map(p => {
        // Local ring rotation
        const cosR = Math.cos(ringRotZ), sinR = Math.sin(ringRotZ);
        const lx = p.x * cosR - p.y * sinR;
        const ly = p.x * sinR + p.y * cosR;

        // Apply ring tilt
        const cosTiltX = Math.cos(ring.axisAngleX), sinTiltX = Math.sin(ring.axisAngleX);
        const ty = ly * cosTiltX;
        const tz = ly * sinTiltX;

        return project(lx, ty, tz, totalRotX, totalRotY);
      });

      // Draw ring path
      ctx.beginPath();
      projPoints.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();

      ctx.strokeStyle = idx === 1 ? 'rgba(245, 158, 11, 0.45)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = idx === 1 ? 1.5 : 1.0;
      ctx.stroke();

      // Render orbiting ring nodes
      const nodeIndex = Math.floor((time * 0.02 + idx * 16) % RING_POINTS);
      const nodePt = projPoints[nodeIndex];
      if (nodePt && nodePt.scale > 0) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(nodePt.x, nodePt.y, 2.5 * nodePt.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node glow
        ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.beginPath();
        ctx.arc(nodePt.x, nodePt.y, 6.0 * nodePt.scale, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 3. Project Icosahedron Vertices
    const projIco = icoVertices.map(([x, y, z]) => project(x, y, z, totalRotX, totalRotY));

    // Draw Icosahedron Edges with Depth Cueing
    icoEdges.forEach(([i, j]) => {
      const p1 = projIco[i];
      const p2 = projIco[j];

      if (p1.scale <= 0 || p2.scale <= 0) return;

      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.18, Math.min(0.9, 0.55 + avgZ / 220));

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
      ctx.lineWidth = Math.max(0.8, 1.6 * ((p1.scale + p2.scale) / 2));
      ctx.stroke();
    });

    // Draw Icosahedron Glowing Vertices
    projIco.forEach(p => {
      if (p.scale <= 0) return;
      const alpha = Math.max(0.3, Math.min(1.0, 0.65 + p.z / 200));

      // Outer glow
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5.5 * p.scale, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Core
      ctx.fillStyle = alpha > 0.6 ? '#FFFFFF' : '#FBBF24';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2 * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Render 3D Swarm Particles & Constellation Links
    const projParticles = particles.map(pt => {
      // Gentle orbital drift
      const angle = time * pt.speed + pt.phase;
      const px = pt.x * Math.cos(angle * 0.5) - pt.z * Math.sin(angle * 0.5);
      const pz = pt.x * Math.sin(angle * 0.5) + pt.z * Math.cos(angle * 0.5);
      const py = pt.y + Math.sin(angle) * 12;

      return {
        ...project(px, py, pz, totalRotX, totalRotY),
        baseSize: pt.size
      };
    });

    // Draw particle connections when close
    for (let i = 0; i < projParticles.length; i++) {
      for (let j = i + 1; j < projParticles.length; j++) {
        const p1 = projParticles[i];
        const p2 = projParticles[j];
        if (p1.scale <= 0 || p2.scale <= 0) continue;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 3200) {
          const t = 1 - Math.sqrt(distSq) / 56.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${t * 0.28})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Draw particle dots
    projParticles.forEach(p => {
      if (p.scale <= 0) return;
      const alpha = Math.max(0.2, Math.min(0.9, 0.5 + p.z / 240));
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.baseSize * p.scale, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  // ─── Mouse Tracking for 3D Perspective Tilt ───
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // Convert mouse displacement into target angles
    targetRotY = (mouseX / (rect.width / 2)) * 0.75;
    targetRotX = -(mouseY / (rect.height / 2)) * 0.65;
  }

  function onMouseLeave() {
    targetRotX = 0.2;
    targetRotY = 0.3;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left - rect.width / 2;
      const touchY = e.touches[0].clientY - rect.top - rect.height / 2;
      targetRotY = (touchX / (rect.width / 2)) * 0.6;
      targetRotX = -(touchY / (rect.height / 2)) * 0.5;
    }
  }

  // Visibility handling
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // ─── Initialize ───
  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
