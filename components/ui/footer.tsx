export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl">🐄</span>
              </div>
              <span className="text-xl">CowToken</span>
            </div>
            <p className="text-gray-400">
              Transparent cattle investment platform with guaranteed returns.
            </p>
          </div>
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-400">
              <p
                className="cursor-pointer hover:text-white transition-colors"
                // onClick={() => onNavigate("landing")}
              >
                Home
              </p>
              <p
                className="cursor-pointer hover:text-white transition-colors"
                // onClick={() => onNavigate("rounds")}
              >
                Investment Rounds
              </p>
              <p
                className="cursor-pointer hover:text-white transition-colors"
                // onClick={() => onNavigate("dashboard")}
              >
                Dashboard
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <p>Email: invest@cowtoken.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 CowToken. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
