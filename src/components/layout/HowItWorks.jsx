import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiHelpCircle, FiZap, FiCheckSquare } from 'react-icons/fi';

const STEPS = [
  {
    number: 1,
    icon: FiUser,
    title: 'Start a Conversation',
    description: 'Begin by asking any question about admissions, programs, or requirements.',
  },
  {
    number: 2,
    icon: FiHelpCircle,
    title: 'Receive Instant Answers',
    description: 'Get comprehensive responses tailored to your specific query.',
  },
  {
    number: 3,
    icon: FiZap,
    title: 'Explore More Options',
    description: 'Ask follow-up questions and get personalized recommendations.',
  },
  {
    number: 4,
    icon: FiCheckSquare,
    title: 'Make Informed Decisions',
    description: 'Have all the information you need to take the next steps.',
  },
];

function HowItWorks() {
  return (
    <section className="section-padding bg-gray-50" id="how-it-works">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Simple steps to get started with your admission journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}

                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary-600" size={24} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(HowItWorks);
