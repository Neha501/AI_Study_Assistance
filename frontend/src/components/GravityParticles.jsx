// components/GravityParticles.jsx
import { useEffect, useRef } from "react";

const GravityParticles = ({ mousePosition }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width, height;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.color = `rgba(${100 + Math.random() * 100}, ${100 + Math.random() * 100}, 255, ${0.5 + Math.random() * 0.3})`;
                this.mass = this.radius * 2;
            }

            update(gravityX, gravityY) {
                // Apply gravity force towards mouse
                const dx = gravityX - this.x;
                const dy = gravityY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const force = (200 - distance) / 200 * 0.02; // stronger when closer
                    const angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force;
                    this.vy += Math.sin(angle) * force;
                }

                // Add some randomness
                this.vx += (Math.random() - 0.5) * 0.02;
                this.vy += (Math.random() - 0.5) * 0.02;

                // Damping
                this.vx *= 0.99;
                this.vy *= 0.99;

                // Update position
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges with padding
                if (this.x < -50) this.x = width + 50;
                if (this.x > width + 50) this.x = -50;
                if (this.y < -50) this.y = height + 50;
                if (this.y > height + 50) this.y = -50;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                // Add a subtle glow
                ctx.shadowColor = 'rgba(100, 100, 255, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            }
        }

        const initParticles = () => {
            const particleCount = Math.min(200, Math.floor((width * height) / 8000)); // responsive count
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                particlesRef.current.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Mouse position for gravity
            const gravityX = mousePosition?.x || width / 2;
            const gravityY = mousePosition?.y || height / 2;

            particlesRef.current.forEach((particle) => {
                particle.update(gravityX, gravityY);
                particle.draw();
            });

            // Reset shadow to avoid affecting other drawings
            ctx.shadowBlur = 0;

            animationRef.current = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener("resize", resize);
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [mousePosition]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default GravityParticles;