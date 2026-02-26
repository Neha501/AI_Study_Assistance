// components/StarfieldBackground.jsx
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const StarfieldBackground = ({
    starCount = 800,
    shootingStarRate = 0.02, // probability per frame
    twinkleSpeed = 0.005,
    parallaxFactor = 0.02,
    baseColor = "#ffffff",
    nebulaColors = ["#0f172a", "#1e1b4b", "#2e1065", "#4c1d95"],
}) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalized mouse position
    const starsRef = useRef([]);
    const shootingStarsRef = useRef([]);
    const animationRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Initialize stars
        const initStars = () => {
            starsRef.current = Array.from({ length: starCount }, () => ({
                x: Math.random(),
                y: Math.random(),
                z: Math.random() * 0.8 + 0.2, // depth for parallax
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.01 + 0.002,
                twinklePhase: Math.random() * Math.PI * 2,
            }));
        };
        initStars();

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX / width,
                y: e.clientY / height,
            };
        };

        // Resize handler
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars(); // reinitialize stars for new dimensions
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw nebula background (gradient)
            const gradient = ctx.createRadialGradient(
                width * 0.5,
                height * 0.5,
                0,
                width * 0.5,
                height * 0.5,
                width * 0.8
            );
            gradient.addColorStop(0, nebulaColors[0]);
            gradient.addColorStop(0.3, nebulaColors[1]);
            gradient.addColorStop(0.6, nebulaColors[2]);
            gradient.addColorStop(1, nebulaColors[3]);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw stars
            starsRef.current.forEach((star) => {
                // Parallax shift based on mouse and depth
                const dx = (mouseRef.current.x - 0.5) * width * parallaxFactor * star.z;
                const dy = (mouseRef.current.y - 0.5) * height * parallaxFactor * star.z;
                const x = star.x * width + dx;
                const y = star.y * height + dy;

                // Twinkling brightness
                const twinkle = Math.sin(performance.now() * star.twinkleSpeed + star.twinklePhase) * 0.2 + 0.8;
                const brightness = star.brightness * twinkle;

                ctx.beginPath();
                ctx.arc(x, y, star.size * (0.8 + 0.4 * star.z), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                ctx.fill();
            });

            // Shooting stars
            if (Math.random() < shootingStarRate) {
                const startX = Math.random() * width * 0.8 + width * 0.1; // avoid edges
                const startY = Math.random() * height * 0.3; // top third
                const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // diagonal down-right
                const length = 50 + Math.random() * 100;
                shootingStarsRef.current.push({
                    x: startX,
                    y: startY,
                    vx: Math.cos(angle) * 8,
                    vy: Math.sin(angle) * 8,
                    age: 0,
                    maxAge: 40 + Math.floor(Math.random() * 30),
                    length,
                });
            }

            // Update and draw shooting stars
            shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
                s.age++;
                if (s.age > s.maxAge) return false;

                // Draw shooting star trail
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - s.age / s.maxAge})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw head
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - s.age / s.maxAge})`;
                ctx.fill();

                // Update position
                s.x += s.vx;
                s.y += s.vy;
                return true;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [starCount, shootingStarRate, twinkleSpeed, parallaxFactor, baseColor, nebulaColors]);

    return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />;
};

StarfieldBackground.propTypes = {
    starCount: PropTypes.number,
    shootingStarRate: PropTypes.number,
    twinkleSpeed: PropTypes.number,
    parallaxFactor: PropTypes.number,
    baseColor: PropTypes.string,
    nebulaColors: PropTypes.arrayOf(PropTypes.string),
};

export default StarfieldBackground;