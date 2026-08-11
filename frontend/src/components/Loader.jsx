import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const barRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onDone && onDone();
      },
    });

    tl.set(markRef.current, { scale: 0.6, rotate: -20 });
    tl.to(markRef.current, {
      scale: 1,
      rotate: 0,
      duration: 0.7,
      ease: 'back.out(2)',
    });
    tl.to(
      barRef.current,
      { scaleX: 1, duration: 1.1, ease: 'power2.inOut' },
      '<0.1'
    );
    tl.to(
      counter,
      {
        value: 100,
        duration: 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (percentRef.current) {
            percentRef.current.textContent = Math.round(counter.value);
          }
        },
      },
      '<'
    );
    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
      delay: 0.15,
    });

    return () => tl.kill();
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="app-loader" ref={rootRef}>
      <div className="app-loader-mark" ref={markRef}>
        <img src="/assets/logo-mark.svg" alt="" />
      </div>
      <div className="app-loader-word">
        College<span>B</span>azaar
      </div>
      <div className="app-loader-track">
        <div className="app-loader-bar" ref={barRef} />
      </div>
      <div className="app-loader-percent">
        <span ref={percentRef}>0</span>%
      </div>

      <style>{`
        .app-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #05070f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .app-loader-mark img {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          filter: drop-shadow(0 0 24px rgba(99, 102, 241, 0.6));
        }

        .app-loader-word {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #f1f5f9;
        }

        .app-loader-word span {
          background: linear-gradient(120deg, #818cf8, #22d3ee);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .app-loader-track {
          width: 220px;
          height: 3px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.18);
          overflow: hidden;
        }

        .app-loader-bar {
          width: 100%;
          height: 100%;
          transform-origin: left center;
          transform: scaleX(0);
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          border-radius: 999px;
        }

        .app-loader-percent {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          color: #64748b;
          letter-spacing: 0.08em;
        }
      `}</style>
    </div>
  );
}
