import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';
import { getCallable } from 'src/utils/firebase';

// ----------------------------------------------------------------------

export default function AppPage() {
  const [greeting, setGreeting] = useState(null);
  useEffect(() => {
    getCallable('getGreeting')().then((res) => {
      setGreeting(res.data);
    });
  }, [greeting]);
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>
      {greeting}
      <AppView />
    </>
  );
}
