// Standard fade-up animation
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Drop animation for new fields
export const dropIn = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
}; 