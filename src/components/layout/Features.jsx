import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  FiMessageSquare,
  FiBookOpen,
  FiCheckCircle,
  FiAward,
} from 'react-icons/fi';
import { FEATURES } from '../../constants';

const ICON_MAP = {
  FiMessageSquare: FiMessageSquare,
  FiBookOpen: FiBookOpen,
  FiCheckCircle: FiCheckCircle,
  FiAward: FiAward,
};

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Features() {
  return (
    <section className="section-padding bg-white" id="features">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="mb-4">Chatbot Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to make informed decisions about your university journey
          </p>
        </div>

        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = ICON_MAP[feature.icon];
            return (
              <motion.div
                key={feature.id}
                variants={ITEM_VARIANTS}
                className="p-6 rounded-xl bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-white group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                  <Icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Features);
