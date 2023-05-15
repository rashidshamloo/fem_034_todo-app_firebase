//react
import { useEffect, useRef, useState } from 'react';

// firebase
import { auth } from '../config/firebase';

const useAuth = (onNewUser: () => void) => {
  // state
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);

  // login anonymously and populate default todos
  const setupAnonymousUser = async () => {
    try {
      const result = await auth.signInAnonymously();
      // if it's a new user call onNewUser()
      result.additionalUserInfo?.isNewUser && onNewUser();
    } catch (e) {
      console.error(e);
    }
  };

  // anonymous user setup
  const setupAnon = useRef(true);
  // sign out user and enable anonymous login
  const signOut = () => {
    setupAnon.current = true;
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && setupAnon.current) {
        setupAnon.current = false;
        setupAnonymousUser();
      }
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return { isLoggedin, signOut };
};

export default useAuth;
