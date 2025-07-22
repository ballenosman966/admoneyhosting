import { useRef, useEffect, useState } from "react";

interface AnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  delay?: number;
  onComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
}) => {
  // Simple fallback - just render children immediately
  return <div>{children}</div>;
};

export default AnimatedContent; 