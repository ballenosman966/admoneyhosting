import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  isActive: boolean;
  className?: string;
}

export const AnimatedHomeIcon: React.FC<AnimatedIconProps> = ({ isActive, className = "w-6 h-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={false}
      animate={isActive ? "active" : "inactive"}
    >
      {/* House Roof */}
      <motion.path
        d="M3 9.5L12 2l9 7.5"
        variants={{
          inactive: { 
            strokeWidth: 2,
            opacity: 0.8,
            pathLength: 0.7
          },
          active: { 
            strokeWidth: 2.5,
            opacity: 1,
            pathLength: 1
          }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* House Base */}
      <motion.path
        d="M4 9.5v11a2 2 0 002 2h12a2 2 0 002-2v-11"
        variants={{
          inactive: { 
            fill: "transparent",
            strokeWidth: 2,
            scale: 1,
            opacity: 0.8
          },
          active: { 
            fill: "rgba(255, 193, 7, 0.2)",
            strokeWidth: 2.5,
            scale: 1.05,
            opacity: 1
          }
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      />
      
      {/* Door */}
      <motion.path
        d="M9 21V12a1 1 0 011-1h4a1 1 0 011 1v9"
        variants={{
          inactive: { 
            strokeWidth: 1.5,
            opacity: 0.6,
            scaleY: 0.8
          },
          active: { 
            strokeWidth: 2,
            opacity: 1,
            scaleY: 1,
            fill: "rgba(255, 193, 7, 0.3)"
          }
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      
      {/* Windows */}
      <motion.circle
        cx="7.5"
        cy="15"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.8,
            fill: "rgba(255, 193, 7, 0.6)"
          }
        }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
      <motion.circle
        cx="16.5"
        cy="15"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.8,
            fill: "rgba(255, 193, 7, 0.6)"
          }
        }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
      
      {/* Door Handle */}
      <motion.circle
        cx="11.5"
        cy="17"
        r="0.3"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 1,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.5 }}
      />
    </motion.svg>
  );
};

export const AnimatedPlayIcon: React.FC<AnimatedIconProps> = ({ isActive, className = "w-6 h-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={false}
      animate={isActive ? "active" : "inactive"}
    >
      {/* Play Button Circle Background */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        variants={{
          inactive: { 
            fill: "transparent",
            strokeWidth: 2,
            scale: 1
          },
          active: { 
            fill: "rgba(255, 255, 255, 0.1)",
            strokeWidth: 2.5,
            scale: 1.05
          }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Play Triangle */}
      <motion.path
        d="M9 8l6 4-6 4V8z"
        variants={{
          inactive: { 
            fill: "transparent",
            strokeWidth: 2,
            scale: 1,
            x: 0
          },
          active: { 
            fill: "currentColor",
            strokeWidth: 0,
            scale: 1.1,
            x: 1
          }
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      />
      
      {/* Sound Waves */}
      <motion.path
        d="M15.5 8.5c.5.5.8 1.2.8 2s-.3 1.5-.8 2"
        variants={{
          inactive: { 
            opacity: 0,
            pathLength: 0
          },
          active: { 
            opacity: 0.6,
            pathLength: 1
          }
        }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      <motion.path
        d="M17 6c1 1 1.6 2.4 1.6 4s-.6 3-1.6 4"
        variants={{
          inactive: { 
            opacity: 0,
            pathLength: 0
          },
          active: { 
            opacity: 0.4,
            pathLength: 1
          }
        }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
      
      {/* Pulse Effect */}
      <motion.circle
        cx="12"
        cy="12"
        r="12"
        stroke="currentColor"
        strokeWidth="1"
        fill="transparent"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0, 0.2]
          }
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          delay: 0.5
        }}
      />
    </motion.svg>
  );
};

export const AnimatedWalletIcon: React.FC<AnimatedIconProps> = ({ isActive, className = "w-6 h-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={false}
      animate={isActive ? "active" : "inactive"}
    >
      {/* Wallet Base */}
      <motion.path
        d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5"
        variants={{
          inactive: { 
            fill: "transparent",
            strokeWidth: 2
          },
          active: { 
            fill: "rgba(255, 255, 255, 0.1)",
            strokeWidth: 2
          }
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Wallet Flap */}
      <motion.path
        d="M21 12h-6a2 2 0 100 4h6v-4z"
        variants={{
          inactive: { 
            fill: "transparent",
            x: 0
          },
          active: { 
            fill: "currentColor",
            x: -2
          }
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      
      {/* Coins */}
      <motion.circle
        cx="8"
        cy="10"
        r="1.5"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.8,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
      <motion.circle
        cx="11"
        cy="13"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.6,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
    </motion.svg>
  );
};

export const AnimatedCrownIcon: React.FC<AnimatedIconProps> = ({ isActive, className = "w-6 h-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={false}
      animate={isActive ? "active" : "inactive"}
    >
      {/* Crown Base */}
      <motion.path
        d="M6 20h12l1-8-4.5 3L12 10l-2.5 5L5 12l1 8z"
        variants={{
          inactive: { 
            fill: "transparent",
            strokeWidth: 2
          },
          active: { 
            fill: "rgba(255, 193, 7, 0.3)",
            strokeWidth: 2
          }
        }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Crown Points/Jewels */}
      <motion.circle
        cx="6"
        cy="6"
        r="2"
        variants={{
          inactive: { 
            scale: 0.5,
            fill: "transparent"
          },
          active: { 
            scale: 1,
            fill: "rgba(255, 193, 7, 0.8)"
          }
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.circle
        cx="12"
        cy="4"
        r="2"
        variants={{
          inactive: { 
            scale: 0.5,
            fill: "transparent"
          },
          active: { 
            scale: 1,
            fill: "rgba(255, 193, 7, 0.8)"
          }
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.circle
        cx="18"
        cy="6"
        r="2"
        variants={{
          inactive: { 
            scale: 0.5,
            fill: "transparent"
          },
          active: { 
            scale: 1,
            fill: "rgba(255, 193, 7, 0.8)"
          }
        }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      
      {/* Glow Effect */}
      <motion.circle
        cx="12"
        cy="12"
        r="8"
        stroke="rgba(255, 193, 7, 0.4)"
        strokeWidth="1"
        fill="transparent"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0, 0.2]
          }
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          delay: 0.5
        }}
      />
    </motion.svg>
  );
};

export const AnimatedMoreIcon: React.FC<AnimatedIconProps> = ({ isActive, className = "w-6 h-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={false}
      animate={isActive ? "active" : "inactive"}
    >
      {/* Three Dots */}
      <motion.circle
        cx="5"
        cy="12"
        r="2"
        variants={{
          inactive: { 
            fill: "currentColor",
            y: 0,
            scale: 1
          },
          active: { 
            fill: "currentColor",
            y: -3,
            scale: 1.2
          }
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="2"
        variants={{
          inactive: { 
            fill: "currentColor",
            y: 0,
            scale: 1
          },
          active: { 
            fill: "currentColor",
            y: -5,
            scale: 1.3
          }
        }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      <motion.circle
        cx="19"
        cy="12"
        r="2"
        variants={{
          inactive: { 
            fill: "currentColor",
            y: 0,
            scale: 1
          },
          active: { 
            fill: "currentColor",
            y: -3,
            scale: 1.2
          }
        }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      
      {/* Additional Dots for "more" effect */}
      <motion.circle
        cx="5"
        cy="18"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.6,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
      <motion.circle
        cx="12"
        cy="19"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.6,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.5 }}
      />
      <motion.circle
        cx="19"
        cy="18"
        r="1"
        variants={{
          inactive: { 
            scale: 0,
            opacity: 0
          },
          active: { 
            scale: 1,
            opacity: 0.6,
            fill: "currentColor"
          }
        }}
        transition={{ duration: 0.2, delay: 0.6 }}
      />
    </motion.svg>
  );
}; 