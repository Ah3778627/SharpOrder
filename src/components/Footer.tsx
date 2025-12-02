export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">SharpOrder</h3>
            <p className="text-gray-400 text-sm">
              Your premium destination for quality electronics and hand-woven hats. 
              Experience shopping with excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/products" className="hover:text-white transition">All Products</a></li>
              <li><a href="/cart" className="hover:text-white transition">Cart</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm mb-2">Email: support@sharporder.com</p>
            <p className="text-gray-400 text-sm mb-2">Phone: 1-800-SHOP-NOW</p>
            <p className="text-gray-400 text-sm">Free shipping on orders over $50</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2024 SharpOrder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
