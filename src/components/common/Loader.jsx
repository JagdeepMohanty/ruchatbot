import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0.6, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

const DOTS = [0, 1, 2];

function Loader({ fullScreen = false }) {
  const dots = useMemo(() => DOTS, []);

  return (
    <div className={fullScreen ? 'fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm' : ''}>
      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="show"
        className="flex gap-2"
      >
        {dots.map((i) => (
          <motion.div
            key={i}
            variants={ITEM_VARIANTS}
            className="w-3 h-3 bg-primary-600 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
}

export default memo(Loader);
