import React, { useRef, ReactNode, MouseEventHandler } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index?: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index = 0,
  onMouseEnter,
  onClick,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={className}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: "1rem", cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedItem; 