import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggIn(true);
        const uid = user.uid;
        setUserObj(uid);
      } else {
        setIsLoggIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        'Initializing . . '
      )}
      <footer>
        &copy; {new Date().getFullYear()}
        Nwitter
      </footer>
    </>
  );
}

export default App;
