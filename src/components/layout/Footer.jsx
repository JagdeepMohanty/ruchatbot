export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-4 sm:py-6">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
          {/* University Info */}
          <div>
            <p className="font-semibold text-gray-900">Rai University</p>
            <p className="text-gray-600 text-xs">Ahmedabad, Gujarat</p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-gray-900">Contact</p>
            <p className="text-gray-600 text-xs">+91 89 8000 4325</p>
            <p className="text-gray-600 text-xs">info@raiuniversity.edu</p>
          </div>

          {/* Website */}
          <div>
            <p className="font-semibold text-gray-900">Visit</p>
            <a href="https://www.raiuniversity.edu" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-xs">
              www.raiuniversity.edu
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-xs text-gray-600">
            © {currentYear} Rai University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
