import { Link } from 'react-router-dom';
import { FiHome, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="flex-1 section-padding bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <span className="inline-block text-6xl font-bold gradient-text">404</span>
            </div>

            <h1 className="mb-4">Page Not Found</h1>

            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
              Sorry, we couldn't find the page you're looking for. Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary flex items-center justify-center gap-2 group">
                <FiHome />
                Back to Home
              </Link>
              <Link to="/chatbot" className="btn-secondary flex items-center justify-center gap-2 group">
                Go to Chatbot
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
