import { useEffect, useRef } from "react";

/**
 * Subtle animated starfield with diagonal shooting stars / meteor trails.
 * Uses canvas for performance. Renders behind content via absolute positioning.
 */
export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    // --- Static stars ---
    interface Star {
      x: number;
      y: number;
      r: number;
      alpha: number;
      pulse: number;
      speed: number;
    }

    // --- Shooting stars ---
    interface Meteor {
      x: number;
      y: number;
      len: number;
      speed: number;
      alpha: number;
      fadeIn: number;
      life: number;
      maxLife: number;
      angle: number;
      thickness: number;
    }

    let stars: Star[] = [];
    let meteors: Meteor[] = [];

    const PRIMARY_H = 243;
    const PRIMARY_S = 100;
    const PRIMARY_L = 68;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      const count = Math.floor((w * h) / 6875);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.6 + 0.15,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.15,
      }));
    }

    function spawnMeteor(): Meteor {
      // Diagonal angle: roughly 30-50 degrees
      const angle = (Math.PI / 180) * 40;
      const startX = Math.random() * w * 1.2 - w * 0.1;
      const startY = -20 - Math.random() * 100;
      return {
        x: startX,
        y: startY,
        len: 80 + Math.random() * 160,
        speed: 3 + Math.random() * 4,
        alpha: 0,
        fadeIn: 0,
        life: 0,
        maxLife: 90 + Math.random() * 70,
        angle,
        thickness: 0.8 + Math.random() * 1.2,
      };
    }

    let elapsed = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      elapsed++;

      // Draw static stars with subtle pulse
      for (const s of stars) {
        s.pulse += s.speed * 0.02;
        const a = s.alpha + Math.sin(s.pulse) * 0.2;
        const clampA = Math.max(0.08, Math.min(a, 0.8));

        // Slight indigo tint for ~30% of stars
        const isIndigo = s.r > 1.2;
        const hue = isIndigo ? PRIMARY_H : 0;
        const sat = isIndigo ? PRIMARY_S : 0;
        const light = isIndigo ? PRIMARY_L : 100;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${clampA})`;
        ctx!.fill();

        // Tiny glow for larger stars
        if (s.r > 0.9) {
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = `hsla(${PRIMARY_H}, ${PRIMARY_S}%, ${PRIMARY_L}%, ${clampA * 0.18})`;
          ctx!.fill();
        }
      }

      // Spawn meteors occasionally
      if (elapsed % 55 === 0 || (elapsed % 28 === 0 && Math.random() > 0.4)) {
        meteors.push(spawnMeteor());
      }

      // Draw meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;

        // Fade in then fade out
        if (m.life < 12) {
          m.alpha = (m.life / 12) * 0.9;
        } else if (m.life > m.maxLife - 20) {
          m.alpha = ((m.maxLife - m.life) / 20) * 0.9;
        } else {
          m.alpha = 0.9;
        }

        // Move
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;

        // Draw trail
        const tailX = m.x - Math.cos(m.angle) * m.len;
        const tailY = m.y - Math.sin(m.angle) * m.len;

        const grad = ctx!.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `hsla(${PRIMARY_H}, ${PRIMARY_S}%, ${PRIMARY_L}%, ${m.alpha})`);
        grad.addColorStop(0.3, `hsla(${PRIMARY_H}, 60%, 80%, ${m.alpha * 0.5})`);
        grad.addColorStop(1, `hsla(${PRIMARY_H}, ${PRIMARY_S}%, ${PRIMARY_L}%, 0)`);

        ctx!.beginPath();
        ctx!.moveTo(m.x, m.y);
        ctx!.lineTo(tailX, tailY);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = m.thickness;
        ctx!.lineCap = "round";
        ctx!.stroke();

        // Head glow
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(0, 0%, 100%, ${m.alpha * 0.9})`;
        ctx!.fill();

        // Remove dead meteors
        if (m.life > m.maxLife || m.y > h + 50) {
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
