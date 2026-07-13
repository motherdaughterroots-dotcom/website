// import { Routes, Route, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { CartProvider } from './context/CartContext';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import CartDrawer from './components/CartDrawer';
// import FloatingWhatsApp from './components/FloatingWhatsApp';
// import Home from './pages/Home';
// import Shop from './pages/Shop';
// import ProductDetail from './pages/ProductDetail';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import FAQ from './pages/FAQ';

// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
//   return null;
// }

// export default function App() {
//   return (
//     <CartProvider>
//       <ScrollToTop />
//       <Navbar />
//       <CartDrawer />
//       <FloatingWhatsApp />
//       <main>
//         <Routes>
//           <Route path="/"              element={<Home />} />
//           <Route path="/shop"          element={<Shop />} />
//           <Route path="/product/:id"   element={<ProductDetail />} />
//           <Route path="/about"         element={<About />} />
//           <Route path="/contact"       element={<Contact />} />
//           <Route path="/faq"           element={<FAQ />} />
//           <Route path="*"              element={<NotFound />} />
//         </Routes>
//       </main>
//       <Footer />
//     </CartProvider>
//   );
// }

// function NotFound() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
//       <img src="/images/brand/logo.png" alt="" className="w-24 h-24 rounded-full mb-6 opacity-40" />
//       <h1 className="font-display text-4xl text-[var(--color-olive)] mb-3">Page Not Found</h1>
//       <p className="text-[var(--color-bark)]/55 mb-8">This page must have wandered off into the forest.</p>
//       <a href="/" className="px-7 py-3.5 rounded-full bg-[var(--color-olive)] text-white font-medium hover:bg-[var(--color-terracotta)] transition-colors">
//         Back to Home
//       </a>
//     </div>
//   );


// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <FloatingWhatsApp />
        <main>
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/shop"           element={<Shop />} />
            <Route path="/product/:id"    element={<ProductDetail />} />
            <Route path="/about"          element={<About />} />
            <Route path="/contact"        element={<Contact />} />
            <Route path="/faq"            element={<FAQ />} />
            <Route path="/courses"        element={<Courses />} />
            <Route path="/courses/:id"    element={<CourseDetail />} />
            <Route path="*"               element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </ProductsProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24">
      <img src="/images/brand/logo.png" alt="" className="w-24 h-24 rounded-full mb-6 opacity-40" />
      <h1 className="font-display text-4xl text-[var(--color-olive)] mb-3">Page Not Found</h1>
      <p className="text-[var(--color-bark)]/55 mb-8">This page must have wandered off into the forest.</p>
      <a href="/" className="px-7 py-3.5 rounded-full bg-[var(--color-olive)] text-white font-medium hover:bg-[var(--color-terracotta)] transition-colors">
        Back to Home
      </a>
    </div>
  );
}