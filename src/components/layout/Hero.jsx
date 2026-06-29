import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';

export default function Hero() {
  const handleBrochureDownload = () => {
    // Use normalized filename without spaces for deployment-safe paths
    const filename = '/12-Page-Brochure-Single-Page.pdf';
    window.open(filename, '_blank');
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6">
              Your <span className="gradient-text">AI-Powered Guide</span> to University Admissions
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Get instant answers to all your admission questions. Our intelligent chatbot provides personalized guidance throughout your university application journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/chatbot" className="btn-primary flex items-center justify-center gap-2 group">
                Start Chatting
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={handleBrochureDownload}
                className="btn-secondary flex items-center justify-center gap-2 group"
              >
                <FiDownload className="group-hover:translate-y-1 transition-transform" />
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/* <div className="bg-gradient-to-br from-primary-100 to-indigo-100 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-primary-700 font-semibold">Interactive AI Chatbot</p>
              </div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
