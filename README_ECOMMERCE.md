# SharpOrder - E-Commerce Frontend Application

A fully functional e-commerce frontend application selling premium quality electronics and hand-woven hats. Built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

### Product Management
- **16 Premium Products** - 8 electronics and 8 hand-woven hats
- **Detailed Product Pages** - Including images, descriptions, ratings, and reviews
- **Product Search & Filtering** - Search by name/description and filter by category
- **Product Categories** - Electronics and Hand-Woven Hats
- **In-Stock Tracking** - Visual indicators for product availability

### Shopping Cart
- **Add to Cart** - Add products with quantity selection
- **Persistent Cart** - Cart state managed with Zustand store
- **Quantity Management** - Increase/decrease quantities easily
- **Remove Items** - Remove products from cart
- **Real-time Updates** - Cart icon shows item count

### Checkout & Pricing
- **Order Summary** - Subtotal, shipping, tax calculation
- **Free Shipping** - Automatic free shipping on orders over $50
- **Tax Calculation** - 10% tax applied to orders
- **Checkout Flow** - Complete purchase flow with order summary

### User Experience
- **Responsive Design** - Mobile-first responsive layout
- **Header Navigation** - Easy navigation between products and cart
- **Product Cards** - Beautiful product display with images and ratings
- **Star Ratings** - Display product ratings and review counts
- **Smooth Animations** - Transitions and hover effects throughout
- **Footer** - Company info and quick links

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component
- **Package Manager**: npm

## Project Structure

```
sharporder/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── cart/
│   │   │   └── page.tsx        # Shopping cart page
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Product detail page
│   │   ├── products/
│   │   │   └── page.tsx        # Products listing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer component
│   │   └── ProductCard.tsx     # Product card component
│   └── lib/
│       ├── products.ts         # Product data
│       └── store.ts            # Zustand store configuration
├── public/                     # Static files
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.ts              # Next.js config
└── vercel.json                 # Vercel deployment config
```

## Installation

### Prerequisites
- Node.js 20.9.0 or higher
- npm 10.x or higher

### Setup Steps

1. **Clone or navigate to the project directory**
```bash
cd /home/abdul-hafiz/Desktop/python/sharporder
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features Detail

### Home Page
- Hero section with call-to-action
- Featured products showcase
- Electronics section
- Hand-Woven Hats section
- "Why Shop With Us" section with benefits

### Products Page
- Grid display of products
- Search functionality
- Category filtering
- Product count display

### Product Details Page
- High-quality product image
- Full product description
- Star ratings with review count
- Price and stock status
- Quantity selector
- Add to cart button
- Related products carousel
- Product benefits section

### Shopping Cart
- List all items in cart
- Product images and details
- Quantity controls
- Remove item functionality
- Order summary with calculations
- Free shipping indicator
- Checkout button

## Product Data

### Electronics (8 products)
1. Wireless Earbuds Pro - $129.99
2. USB-C Fast Charger - $49.99
3. Portable SSD 1TB - $149.99
4. Smart Watch Series 5 - $199.99
5. Mechanical Keyboard RGB - $179.99
6. Wireless Mouse Pro - $59.99
7. USB Hub 7-in-1 - $39.99
8. Webcam 4K Ultra HD - $89.99

### Hand-Woven Hats (8 products)
1. Classic Beige Woven Hat - $45.99
2. Bohemian Multicolor Hat - $54.99
3. Black Formal Woven Hat - $64.99
4. Vibrant Yellow Sun Hat - $49.99
5. Neutral Taupe Woven Cap - $42.99
6. Earth Tone Straw Hat - $55.99
7. Rustic Brown Fedora - $59.99
8. Tropical Print Woven Hat - $52.99

## Deployment on Vercel

### Quick Deploy Steps

1. **Push to GitHub** (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: SharpOrder e-commerce app"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework preset should auto-detect as Next.js
   - Click "Deploy"

3. **Environment Variables**
   - No environment variables required for basic functionality
   - Add any payment processors or APIs as needed

### Live Site
Your site will be live at: `https://<your-project>.vercel.app`

## Customization Guide

### Change Product Data
Edit `src/lib/products.ts` to:
- Add new products
- Modify prices
- Change product descriptions
- Update product images

### Customize Colors
Edit `tailwind.config.ts` to change the color scheme throughout the app.

### Add Payment Integration
1. Choose a payment provider (Stripe, PayPal, etc.)
2. Install provider SDK
3. Update cart checkout flow
4. Add environment variables

### SEO Optimization
- Update meta tags in `src/app/layout.tsx`
- Add sitemap.xml
- Optimize product descriptions for SEO
- Add canonical URLs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Optimization

- ✅ Image optimization with Next.js Image
- ✅ Code splitting with dynamic imports
- ✅ Efficient state management with Zustand
- ✅ CSS-in-JS with Tailwind (no runtime overhead)
- ✅ Server-side rendering for better SEO

## Security Considerations

- All cart data is stored client-side (in production, move to backend)
- Implement proper authentication for orders
- Validate all inputs server-side
- Use HTTPS for payment processing
- Implement CSRF protection

## Future Enhancements

- [ ] User authentication & accounts
- [ ] Order history & tracking
- [ ] Wishlist functionality
- [ ] Product reviews & ratings submission
- [ ] Discount codes & coupons
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Multiple language support

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type errors
```bash
npm run type-check
```

## Support

For issues or questions, contact: support@sharporder.com

## License

© 2024 SharpOrder. All rights reserved.

---

**Ready to deploy?** Push to GitHub and click deploy on Vercel!
