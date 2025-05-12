import { motion } from 'framer-motion';
import { dropIn } from '../animations';

interface DropPlaceholderProps {
  position: 'top' | 'between' | 'bottom';
  variant?: 'default' | 'empty';
}

export const DropPlaceholder = ({ position, variant = 'default' }: DropPlaceholderProps) => {
  if (variant === 'empty') {
    return (
      <motion.div
        key={`drop-${position}`}
        className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-md"
        variants={dropIn}
        initial="hidden"
        animate="show"
        exit="hidden"
      >
        Drag fields from the palette here to build your form
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`drop-${position}`}
      className="h-2 my-2 bg-blue-500 rounded-full drop-placeholder"
      variants={dropIn}
      initial="hidden"
      animate="show"
      exit="hidden"
    />
  );
}; 