// react
import { useCallback, useEffect, useRef } from 'react';

// firebase
import { auth } from '../config/firebase';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';

// firebaseui
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

// style overrides for firebaseui
import '../styles/AuthModal.scss';

// framer motion
import { AnimatePresence, motion } from 'framer-motion';

// types
interface authModalProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  resetTodoList: () => void;
  deleteCurrentTodos: () => void;
  deleteUserPref: (userId: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const AuthModal = ({
  show,
  setShow,
  resetTodoList,
  deleteCurrentTodos,
  deleteUserPref,
  containerRef,
}: authModalProps) => {
  // focus modal on render
  const modalRef = useRef<HTMLDivElement | null>(null);
  const ref = useCallback((node: HTMLDivElement) => {
    if (node) {
      modalRef.current = node;
      node.focus();
    }
  }, []);

  // close modal on ESC + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false);
    };
    const handleFocusIn = () => {
      modalRef.current?.focus();
    };
    document.body.addEventListener('keydown', handleKeyDown);
    containerRef.current?.addEventListener('focusin', handleFocusIn);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
      containerRef.current?.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  useEffect(() => {
    // firebaseui config
    var uiConfig: firebaseui.auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          // populate default todos if user is new
          authResult.additionalUserInfo?.isNewUser && resetTodoList();
          // hide modal on success
          setShow(false);
          return false;
        },
        signInFailure: function (e) {
          // handle merge conflict
          // if we're signing in to a previously made account from a anonymous account,
          // ignore current todo items and delete anonymous account and login the user
          // with new credentials.
          //(could also merge todo lists here but most of the time this is not the desired behavior
          // and i don't like the idea of buggin the user with a choice of whether they want to
          // merge items or not on each login so i'm removing anonymous user todos by default)
          if (e.code.includes('merge-conflict')) {
            if (auth.currentUser?.isAnonymous) {
              // delete anonymous user todos from db
              deleteCurrentTodos();
              // delete anonymous user preferences from db
              deleteUserPref(auth.currentUser.uid);
              //delete anonymous account itself
              auth.currentUser.delete();
            }
            // sign in with new credentials
            auth.signInWithCredential(e.credential);
            // hide modal
            setShow(false);
          }
          return new Promise((res, rej) => {
            res();
          });
        },
      },
      signInFlow: 'popup',
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
      ],
      autoUpgradeAnonymousUsers: true,
    };

    // start firebaseui
    if (show) {
      let ui: firebaseui.auth.AuthUI | null;
      const currentInstance = firebaseui.auth.AuthUI.getInstance();
      if (currentInstance) ui = currentInstance;
      else ui = new firebaseui.auth.AuthUI(auth);
      ui.start('#firebaseui-auth-container', uiConfig);
    }

    // toggle body scroll
    if (show) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="backdrop fixed inset-0 z-20 flex items-center justify-center bg-black/70"
          onClick={(e) => {
            (e.target as HTMLDivElement).classList.contains('backdrop') &&
              setShow(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ delay: 0.1, duration: 0.25 }}
            className="inline-block min-w-[17rem] max-w-[95%] origin-top rounded-md bg-veryLightGray p-2 focus:outline-0 dark:bg-veryDarkDesaturatedBlue"
            role="dialog"
            aria-label="User Login"
            aria-modal="true"
            tabIndex={-1}
            ref={ref}
          >
            <div id="firebaseui-auth-container"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
