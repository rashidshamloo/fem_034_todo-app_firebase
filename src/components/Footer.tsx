// framer motion
import { useRef } from 'react';

// react-responsive
import { useMediaQuery } from 'react-responsive';

// icons
import {
  BsGithub,
  BsFillBriefcaseFill,
  BsLinkedin,
  BsTwitter,
} from 'react-icons/bs';

// types
interface footerProps {
  show: boolean;
  resetTodoList: (removeTodos?: boolean) => void;
  filter: string;
}

const Footer = ({ show, resetTodoList, filter }: footerProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const noHover = useMediaQuery({ query: '(hover: none)' });
  const splitLine = useMediaQuery({ query: '(max-width: 450px)' });
  return (
    <footer className="mx-8 mt-6 select-none flex-col items-center justify-center text-center text-[14px] sm:mx-auto">
      <div>
        <p
          ref={ref}
          className={
            'transition-color whitespace-pre-wrap duration-500 ' +
            (show
              ? 'text-darkGrayishBlue dark:text-darkGrayishBlueD'
              : 'text-white/70 drop-shadow-[0_0_0.5rem_black] dark:text-darkGrayishBlue')
          }
        >
          {filter === 'all' &&
            show &&
            'Drag and drop to reorder list' + (splitLine ? '\n' : '  |  ')}
          <button
            title="Restore Default List"
            className="underline transition-[filter] duration-500 hover:brightness-125"
            onClick={() => resetTodoList(true)}
          >
            {noHover ? 'Press here' : '"shift+z"'}
          </button>{' '}
          to restore default list
        </p>
      </div>
      <div
        className={
          'mx-auto w-3/5 border-t-[1px] border-veryLightGrayishBlue pb-3 pt-2 text-[13px] text-darkGrayishBlue/60 transition-all duration-500 dark:border-veryDarkGrayishBlueD1/50 dark:text-darkGrayishBlueD/50 ' +
          (show ? 'mt-5' : 'mt-9')
        }
      >
        <p>Developed by Rashid Shamloo</p>
        <ul className="mt-1 flex items-center justify-center gap-x-4 sm:gap-x-3 [&_a]:transition-all [&_a]:duration-500 hover:[&_a]:text-veryLightGrayishBlue">
          <li>
            <a
              href="https://www.rashidshamloo.ir"
              title="Portfolio"
              target="_blank"
            >
              <BsFillBriefcaseFill />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/rashidshamloo"
              title="GitHub"
              target="_blank"
            >
              <BsGithub />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/rashid-shamloo/"
              title="LinkedIn"
              target="_blank"
            >
              <BsLinkedin />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/rashidshamloo"
              title="Twitter"
              target="_blank"
            >
              <BsTwitter />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
