import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';
import { getCallable } from 'src/utils/firebase';

// ----------------------------------------------------------------------

export default function AppPage() {
  const [greeting, setGreeting] = useState(null);
  const dateString = 'Tue Jun 04 2024 05:42:06 GMT+0200 (Central European Summer Time)';
  useEffect(() => {
    getCallable('endpoints-getTransportation')().then((res) => {
      console.log(res.data);
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