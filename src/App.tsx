import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

// Rose SVG Component
const RoseSVG = ({ color = '#dc143c', size = 40 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M50 95 L50 50" stroke="#2d5016" strokeWidth="3" fill="none" />
      <ellipse cx="45" cy="70" rx="8" ry="12" fill="#4a7c2c" transform="rotate(-30 45 70)" />
      <ellipse cx="55" cy="60" rx="7" ry="11" fill="#4a7c2c" transform="rotate(25 55 60)" />
      <ellipse cx="50" cy="35" rx="15" ry="18" fill={color} opacity="0.9" />
      <ellipse cx="42" cy="30" rx="12" ry="15" fill={color} opacity="0.8" transform="rotate(-20 42 30)" />
      <ellipse cx="58" cy="30" rx="12" ry="15" fill={color} opacity="0.8" transform="rotate(20 58 30)" />
      <ellipse cx="50" cy="25" rx="10" ry="12" fill={color} opacity="0.95" />
      <ellipse cx="50" cy="28" rx="6" ry="8" fill="#8b0000" opacity="0.6" />
    </g>
  </svg>
);

// Heart SVG for the celebration
const HeartSVG = ({ color = '#ff1493', size = 30 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85 C50 85 15 60 15 35 C15 20 25 10 35 10 C42 10 48 15 50 20 C52 15 58 10 65 10 C75 10 85 20 85 35 C85 60 50 85 50 85 Z" fill={color} />
  </svg>
);

function App() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number, y: number } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isMoved, setIsMoved] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  // Sync initial position to the "slot" in the UI
  const syncInitialPosition = useCallback(() => {
    if (slotRef.current && containerRef.current && !isMoved) {
      const slotRect = slotRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setNoButtonPosition({
        x: slotRect.left - containerRect.left,
        y: slotRect.top - containerRect.top
      });
    }
  }, [isMoved]);

  useEffect(() => {
    syncInitialPosition();
    window.addEventListener('resize', syncInitialPosition);
    return () => window.removeEventListener('resize', syncInitialPosition);
  }, [syncInitialPosition]);

  const handleYesClick = () => {
    setShowCelebration(true);
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff69b4', '#ff1493'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff69b4', '#ff1493'] });
    }, 250);
  };

  const moveNoButton = () => {
    if (!containerRef.current || !noButtonRef.current || !noButtonPosition) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = noButtonRef.current.getBoundingClientRect();
    const yesButton = document.querySelector('.yes-button');
    const yesRect = yesButton?.getBoundingClientRect();

    const cWidth = containerRect.width;
    const cHeight = containerRect.height;
    const bWidth = btnRect.width;
    const bHeight = btnRect.height;

    const margin = 30; // Extra safety buffer
    const minX = margin;
    const maxX = cWidth - bWidth - margin;
    const minY = margin;
    const maxY = cHeight - bHeight - margin;

    let nextX = noButtonPosition.x;
    let nextY = noButtonPosition.y;
    let found = false;
    let tryLimit = 50;

    while (!found && tryLimit > 0) {
      tryLimit--;

      // Pick a random location in the WHOLE box
      // (User recommendation: pick absolute random is more reliable than vectors)
      const candX = minX + Math.random() * (maxX - minX);
      const candY = minY + Math.random() * (maxY - minY);

      // Check overlap with YES
      let overlaps = false;
      if (yesRect) {
        const globalCandLeft = containerRect.left + candX;
        const globalCandTop = containerRect.top + candY;
        const buffer = 40;
        if (
          globalCandLeft < yesRect.right + buffer &&
          globalCandLeft + bWidth > yesRect.left - buffer &&
          globalCandTop < yesRect.bottom + buffer &&
          globalCandTop + bHeight > yesRect.top - buffer
        ) {
          overlaps = true;
        }
      }

      // Ensure we physically move away from the current click point (the current position)
      const dist = Math.sqrt(Math.pow(candX - noButtonPosition.x, 2) + Math.pow(candY - noButtonPosition.y, 2));

      if (!overlaps && dist > 150) {
        nextX = candX;
        nextY = candY;
        found = true;
      }
    }

    setNoButtonPosition({ x: nextX, y: nextY });
    setIsMoved(true);
    setAttempts(prev => prev + 1);
  };

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    moveNoButton();
  };

  return (
    <div className="app-container" ref={containerRef}>
      {/* Background Decor */}
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>
      <div className="floating-roses">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="floating-rose"
            initial={{ y: -50, x: Math.random() * 1000 }}
            animate={{ y: 2000 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 2 }}
          >
            <RoseSVG size={30} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!showCelebration ? (
          <>
            <motion.div
              className="proposal-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <h1 className="title">Will you be my Valentine? 💕</h1>
              <div className="buttons-container">
                <motion.button className="yes-button" onClick={handleYesClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  YES! 💖
                </motion.button>

                {/* Visual Slot for the No button */}
                <div ref={slotRef} className="no-button-slot" />
              </div>
            </motion.div>

            {/* THE NO BUTTON (Rendered as Sibling to bypass layout traps) */}
            {noButtonPosition && (
              <motion.button
                ref={noButtonRef}
                className="no-button"
                onClick={handleNoClick}
                onTouchStart={handleNoClick}
                initial={{
                  left: noButtonPosition.x,
                  top: noButtonPosition.y,
                  opacity: 0
                }}
                animate={{
                  left: noButtonPosition.x,
                  top: noButtonPosition.y,
                  opacity: 1
                }}
                transition={{
                  type: "spring",
                  stiffness: 800, // Much higher stiffness for "snappy" feel
                  damping: 40,    // Balanced damping for smoothness
                  mass: 0.5       // Lower mass for faster acceleration
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  margin: 0,
                  zIndex: 1000,
                }}
              >
                No
              </motion.button>
            )}
          </>
        ) : (
          <motion.div className="celebration-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="celebration-title">Yay! 🎉</h1>
            <p className="celebration-text">I love you! 💕</p>
            <p className="celebration-text">I knew you'd say yes!</p>
            {attempts > 0 && <p className="attempts-text">...after {attempts} attempt{attempts === 1 ? '' : 's'} 😉</p>}
            <div className="celebration-hearts" style={{ marginTop: '2rem' }}>
              <HeartSVG size={50} color="#ff1493" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
