import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function SuggestedQuestions({ questions, onSelect }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2"
      role="region"
      aria-label="Suggested questions"
    >
      {questions.map((question, idx) => (
        <motion.button
          key={idx}
          variants={item}
          onClick={() => onSelect(question)}
          className="min-h-11 sm:min-h-12 p-2 sm:p-3 text-left text-xs sm:text-sm rounded-lg bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 transition-all group flex items-center justify-between gap-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          aria-label={question}
        >
          <span className="line-clamp-2">{question}</span>
          <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" size={16} aria-hidden="true" />
        </motion.button>
      ))}
    </motion.div>
  );
}

export default memo(SuggestedQuestions);
