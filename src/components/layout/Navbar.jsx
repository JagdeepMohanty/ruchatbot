import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { NAVIGATION } from '../../constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-16 sm:h-16">
      <div className="container-max h-full flex justify-between items-center">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 rounded">
          <img 
            src="https://res.cloudinary.com/dybzmpwaq/image/upload/v1782329237/Screenshot_2026-06-25_004829_h0zttp.png" 
            alt="Rai University Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              // Fallback to site favicon if remote image fails
              try { e.target.onerror = null; e.target.src = '/favicon.svg'; } catch (err) { /* noop */ }
            }}
            loading="lazy"
          />
          {/* <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-900">Rai University</div>
            <div className="text-xs text-gray-500">Ahmedabad</div>
          </div> */}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 rounded px-2 py-1 ${
                isActive(item.href)
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
          <div className="flex flex-col">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-3 text-sm font-medium border-b border-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
