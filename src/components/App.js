import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [userObjs, setUserObjs] = useState(null);
  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggIn(true);
        const uid = user.uid;
        setUserObj(uid);
        setUserObjs({
          displayName: user.displayName,
          uid: user.uid,
        });
      } else {
        setIsLoggIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    //1) 첫번째 방법 - Object 수를 줄인다.
    /*
    setUserObjs({
      displayName: user.displayName,
      uid: user.uid,
    });
    */
    // 2) 두번째 방법 - 새로 저장한다.
    setUserObjs({ ...user });
    //setUserObjs({ displayName: 'vs' });
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          userObjs={userObjs}
          refreshUser={refreshUser}
        />
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
