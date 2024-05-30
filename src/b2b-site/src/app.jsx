import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
