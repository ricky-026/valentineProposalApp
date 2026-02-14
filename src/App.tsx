import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

// Rose SVG Component
const RoseSVG = ({ color = '#dc143c', size = 40 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      {/* Stem */}
      <path d="M50 95 L50 50" stroke="#2d5016" strokeWidth="3" fill="none" />
      {/* Leaves */}
      <ellipse cx="45" cy="70" rx="8" ry="12" fill="#4a7c2c" transform="rotate(-30 45 70)" />
      <ellipse cx="55" cy="60" rx="7" ry="11" fill="#4a7c2c" transform="rotate(25 55 60)" />
      {/* Rose petals */}
      <ellipse cx="50" cy="35" rx="15" ry="18" fill={color} opacity="0.9" />
      <ellipse cx="42" cy="30" rx="12" ry="15" fill={color} opacity="0.8" transform="rotate(-20 42 30)" />
      <ellipse cx="58" cy="30" rx="12" ry="15" fill={color} opacity="0.8" transform="rotate(20 58 30)" />
      <ellipse cx="50" cy="25" rx="10" ry="12" fill={color} opacity="0.95" />
      <ellipse cx="50" cy="28" rx="6" ry="8" fill="#8b0000" opacity="0.6" />
    </g>
  </svg>
);

// Heart SVG Component with variations
const HeartSVG = ({ variant = 'solid', color = '#ff1493', size = 30 }: { variant?: 'solid' | 'outline' | 'sparkle'; color?: string; size?: number }) => {
  if (variant === 'outline') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 85 C50 85 15 60 15 35 C15 20 25 10 35 10 C42 10 48 15 50 20 C52 15 58 10 65 10 C75 10 85 20 85 35 C85 60 50 85 50 85 Z"
          stroke={color} strokeWidth="4" fill="none" />
      </svg>
    );
  } else if (variant === 'sparkle') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 85 C50 85 15 60 15 35 C15 20 25 10 35 10 C42 10 48 15 50 20 C52 15 58 10 65 10 C75 10 85 20 85 35 C85 60 50 85 50 85 Z"
          fill={color} />
        <circle cx="30" cy="25" r="3" fill="white" opacity="0.9" />
        <circle cx="70" cy="25" r="3" fill="white" opacity="0.9" />
        <circle cx="50" cy="15" r="2" fill="white" opacity="0.8" />
      </svg>
    );
  }
  // solid
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 85 C50 85 15 60 15 35 C15 20 25 10 35 10 C42 10 48 15 50 20 C52 15 58 10 65 10 C75 10 85 20 85 35 C85 60 50 85 50 85 Z"
        fill={color} />
    </svg>
  );
};

function App() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleYesClick = () => {
    setShowCelebration(true);

    // Enhanced confetti with fireworks effect
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    // Firework bursts
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Multiple burst points for firework effect
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff69b4', '#ff1493', '#ff69b4', '#ffc0cb', '#ff0080'],
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.4)
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff69b4', '#ff1493', '#ff69b4', '#ffc0cb', '#ff0080'],
        shapes: ['circle', 'square'],
        scalar: randomInRange(0.8, 1.4)
      });
      // Center burst
      if (Math.random() > 0.7) {
        confetti({
          ...defaults,
          particleCount: 30,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#ff1493', '#ff69b4', '#ffd700'],
          spread: 180,
          startVelocity: 45,
          scalar: 1.2
        });
      }
    }, 250);
  };

  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();

    // Calculate safe boundaries (avoiding YES button area and edges)
    const maxX = container.width - button.width - 40;
    const maxY = container.height - button.height - 40;

    let newX, newY;
    let attempts = 0;
    const maxAttempts = 20;

    do {
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      attempts++;

      // Check if new position is far enough from YES button (center area)
      const centerX = container.width / 2;
      const centerY = container.height / 2 + 50;
      const distance = Math.sqrt(Math.pow(newX - centerX, 2) + Math.pow(newY - centerY, 2));

      if (distance > 150 || attempts >= maxAttempts) {
        break;
      }
    } while (attempts < maxAttempts);

    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleNoHover = () => {
    if (!isMobile) {
      moveNoButton();
    }
  };

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    moveNoButton();
  };

  return (
    <div className="app-container" ref={containerRef}>
      {/* Animated background clouds */}
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="cloud cloud4"></div>
        <div className="cloud cloud5"></div>
        <div className="cloud cloud6"></div>
      </div>

      {/* Floating roses in background */}
      <div className="floating-roses">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`rose-${i}`}
            className="floating-rose"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -100,
              rotate: Math.random() * 360
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360 + Math.random() * 360,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              delay: i * 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <RoseSVG color={i % 2 === 0 ? '#dc143c' : '#ff69b4'} size={30 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>

      {/* Ambient hearts in background */}
      <div className="ambient-hearts">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`ambient-heart-${i}`}
            className="ambient-heart"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0.3
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              delay: i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <HeartSVG
              variant={['solid', 'outline', 'sparkle'][Math.floor(Math.random() * 3)] as any}
              color={['#ff69b4', '#ff1493', '#ffc0cb'][Math.floor(Math.random() * 3)]}
              size={20 + Math.random() * 15}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!showCelebration ? (
          <motion.div
            className="proposal-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            >
              Will you be my Valentine? 💕
            </motion.h1>

            <div className="buttons-container">
              <motion.button
                className="yes-button"
                onClick={handleYesClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              >
                YES! 💖
              </motion.button>

              <motion.button
                ref={noButtonRef}
                className="no-button"
                onMouseEnter={handleNoHover}
                onClick={handleNoClick}
                onTouchStart={handleNoClick}
                initial={{ x: 100, opacity: 0 }}
                animate={{
                  x: noButtonPosition.x,
                  y: noButtonPosition.y,
                  opacity: 1
                }}
                transition={{
                  delay: noButtonPosition.x === 0 ? 0.4 : 0,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                style={{
                  position: noButtonPosition.x !== 0 ? 'absolute' : 'relative'
                }}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="celebration-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <motion.h1
              className="celebration-title"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              Yay! 🎉
            </motion.h1>

            <motion.p
              className="celebration-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              I knew you'd say yes! 💕
            </motion.p>

            {/* Popping hearts from center */}
            <div className="popping-hearts-container">
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const distance = 150 + Math.random() * 100;
                return (
                  <motion.div
                    key={`pop-heart-${i}`}
                    className="popping-heart"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0
                    }}
                    animate={{
                      x: Math.cos(angle) * distance,
                      y: Math.sin(angle) * distance,
                      scale: [0, 1.5, 1, 0],
                      opacity: [0, 1, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.05,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <HeartSVG
                      variant={i % 3 === 0 ? 'sparkle' : 'solid'}
                      color={['#ff1493', '#ff69b4', '#ff0080'][i % 3]}
                      size={25 + Math.random() * 15}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Floating hearts (existing) */}
            <div className="hearts-container">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="heart"
                  initial={{
                    y: 100,
                    x: Math.random() * window.innerWidth,
                    opacity: 0
                  }}
                  animate={{
                    y: -100,
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.2, 1, 0.8]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                  style={{
                    left: `${Math.random() * 100}%`
                  }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>

            {/* Falling rose petals */}
            <div className="rose-petals-container">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={`petal-${i}`}
                  className="rose-petal"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: Math.random() * 360,
                    opacity: 0.8
                  }}
                  animate={{
                    y: window.innerHeight + 50,
                    rotate: 360 + Math.random() * 720,
                    x: Math.random() * window.innerWidth,
                    opacity: [0.8, 1, 0.6, 0]
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                    ease: 'easeInOut'
                  }}
                >
                  <RoseSVG color={i % 2 === 0 ? '#dc143c' : '#ff69b4'} size={15 + Math.random() * 10} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
