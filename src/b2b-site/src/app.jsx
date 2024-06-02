import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import ThemeProvider from 'src/theme';
import { CartProvider } from 'src/context/CartContext';
import Router from 'src/routes/sections';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <CartProvider >
      <Router />
      </CartProvider >
    </ThemeProvider>
  );
}
