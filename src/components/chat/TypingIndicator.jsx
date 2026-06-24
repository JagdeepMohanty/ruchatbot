import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

const DOT_VARIANTS = {
  hidden: { opacity: 0.6, y: 0 },
  show: {
    opacity: 1,
    y: -10,
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

const DOTS = [0, 1, 2];

function TypingIndicator() {
  const dots = useMemo(() => DOTS, []);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-none w-fit">
      {dots.map((i) => (
        <motion.div
          key={i}
          variants={DOT_VARIANTS}
          initial="hidden"
          animate="show"
          transition={{ delay: i * 0.2 }}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
      ))}
    </div>
  );
}

export default memo(TypingIndicator);
