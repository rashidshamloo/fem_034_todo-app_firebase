// firebase
import { auth } from '../config/firebase';

// theme-toggles
import '@theme-toggles/react/css/Classic.css';
import { Classic } from '@theme-toggles/react';

// react-responsive
import { useMediaQuery } from 'react-responsive';

// types
interface headerProps {
  darkMode: boolean;
  onToggle: () => void;
  setShowAuth: React.Dispatch<React.SetStateAction<boolean>>;
  signOut: () => void;
  isLoggedin: boolean;
}

const Header = ({
  darkMode,
  setShowAuth,
  onToggle,
  signOut,
  isLoggedin,
}: headerProps) => {
  const isLoggedinNotAnon = isLoggedin && !auth.currentUser?.isAnonymous;
  const showSignedinText = useMediaQuery({ query: '(min-width: 600px)' });
  return (
    <header className="pt-2 text-[2.25rem] sm:text-[2.5rem]">
      <div className="mr-8 mt-2 text-right text-[15px] font-medium drop-shadow-[0_0_0.25rem_rgba(0,0,0,0.1)] sm:mr-0 [&_*:not(span)]:text-white/70 dark:[&_*:not(span)]:text-darkGrayishBlue [&_*]:transition-all [&_*]:duration-500 hover:[&_button]:text-white">
        <p>
          {showSignedinText && isLoggedinNotAnon ? 'Signed in as: ' : ''}
          <span className="text-white">
            {isLoggedinNotAnon
              ? auth.currentUser!.displayName || auth.currentUser!.email
              : 'Guest Mode'}
          </span>
          {' | '}
          <button
            className="underline"
            onClick={() => {
              isLoggedinNotAnon ? signOut() : setShowAuth((prev) => !prev);
            }}
          >
            {isLoggedinNotAnon ? 'Sign out' : 'Sign in'}
          </button>
        </p>
      </div>
      <div
        className={
          "absolute left-0 top-0 -z-[1] h-[200px] w-full bg-[url('/images/bg-mobile-light.jpg')] bg-cover bg-center bg-no-repeat transition-all duration-500 sm:h-[18.75rem] sm:bg-[url('/images/bg-desktop-light.jpg')] " +
          (darkMode ? 'opacity-0' : '')
        }
        aria-hidden="true"
      ></div>
      <div
        className={
          "absolute left-0 top-0 -z-[1] h-[200px] w-full bg-[url('/images/bg-mobile-dark.jpg')] bg-cover bg-center bg-no-repeat transition-all duration-500 sm:h-[18.75rem] sm:bg-[url('/images/bg-desktop-dark.jpg')] " +
          (darkMode ? '' : 'opacity-0')
        }
        aria-hidden="true"
      ></div>
      <div className="mt-2 flex justify-between sm:mt-[1.75rem]">
        <h1 className="ml-[6%] select-none font-bold tracking-[0.8rem] text-white sm:ml-0 sm:tracking-[1rem]">
          TODO
        </h1>
        <Classic
          duration={750}
          onToggle={onToggle}
          toggled={darkMode ? false : true}
          className="mr-[6%] text-4xl text-white transition-all duration-500 hover:scale-110 hover:text-blue-200 hover:drop-shadow-[0_0_0.5rem_hsla(0,0%,0%,0.25)] sm:mr-0"
        />
      </div>
    </header>
  );
};

export default Header;
