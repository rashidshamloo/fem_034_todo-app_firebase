// react
import { useEffect, useRef } from 'react';

// framer motion
import { useMotionValue, Reorder } from 'framer-motion';

// react-responsive
import { useMediaQuery } from 'react-responsive';

// types
import { todo } from '../App';

interface TodoProps {
  data: todo;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  containerRef: React.MutableRefObject<HTMLUListElement | undefined>;
  listFilter: string;
}

const Todo = ({
  data,
  toggleTodo,
  removeTodo,
  containerRef,
  listFilter,
}: TodoProps) => {
  const y = useMotionValue(0);
  const filter = useMotionValue('brightness(100%)');

  // Reorder.Item ref
  const ref = useRef<HTMLElement>();

  // handle events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleTodo(data.id);
  };
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    removeTodo(data.id);
  };

  // media query to always show remove button on touch devices
  const isTouch = useMediaQuery({ query: '(hover:none)' });

  // change cursor based on y
  useEffect(() => {
    const handleDragStyle = (yPos: number) => {
      // console.log(yPos);
      if (yPos !== 0) {
        ref.current?.classList.add('pointer-events-none');
        setTimeout(() => {
          if (y.get() === yPos) y.set(0);
        }, 50);
      } else {
        ref.current?.classList.remove('pointer-events-none');
      }
    };
    const unsubscribe = y.on('change', handleDragStyle);
    return () => unsubscribe();
  }, [y]);

  return (
    <li className={'group relative ' + (y.get() !== 0 ? 'z-10' : ' z-[1]')}>
      <Reorder.Item
        as="div"
        key={data.id}
        initial={{
          height: 0,
          opacity: 0,
        }}
        animate={{
          height: 'auto',
          opacity: 1,
        }}
        exit={{ height: 0, opacity: 0, border: 0 }}
        ref={ref}
        className={
          'flex w-full select-none items-center justify-start gap-x-6 overflow-hidden border-b-[1px] border-veryLightGrayishBlue bg-white px-6 transition-[background-color,border-color] duration-500 first:rounded-t-md dark:border-veryDarkGrayishBlueD1 dark:bg-veryDarkGrayishBlueD2 ' +
          (listFilter === 'all' ? '' : ' pointer-events-none')
        }
        style={{ y, filter }}
        value={data}
        onTouchStart={() => {
          filter.set('brightness(95%)');
          // adding touchEnd to document because when the item has moved,
          // the touchEnd event doesn't fire
          document.addEventListener(
            'touchend',
            () => {
              filter.set('brightness(100%)');
            },
            { once: true }
          );
        }}
        onMouseDown={() => {
          filter.set('brightness(95%)');
          containerRef.current?.classList.add('cursor-grabbing');
          // adding mouseUp to document because when the item has moved,
          // the mouseUp event doesn't fire
          document.addEventListener(
            'mouseup',
            () => {
              filter.set('brightness(100%)');
              containerRef.current?.classList.remove('cursor-grabbing');
            },
            { once: true }
          );
        }}
      >
        <input
          id={'add-todo-' + data.id}
          type="checkbox"
          name="completed"
          className="peer sr-only"
          checked={data.completed}
          onChange={handleChange}
        />
        <label
          htmlFor={'add-todo-' + data.id}
          className="pointer-events-auto relative flex aspect-square w-[1.5rem] flex-shrink-0 items-center justify-center rounded-full bg-lightGrayishBlue transition-[background-color] duration-500 peer-checked:bg-check peer-enabled:cursor-pointer peer-enabled:hover:bg-check dark:bg-veryDarkGrayishBlueD1 [&>img]:opacity-0 peer-checked:[&>img]:opacity-100 [&>span]:bg-white peer-checked:[&>span]:bg-transparent dark:[&>span]:bg-veryDarkGrayishBlueD2"
          title="Toggle Completed"
        >
          <span
            className="absolute inset-[1px] rounded-full transition-[background-color] duration-500"
            aria-hidden="true"
          ></span>
          <img src="images/icon-check.svg" aria-hidden="true" alt="" />
        </label>
        <p className="flex h-full items-center justify-start py-4 text-[16px] transition-[color] duration-500 peer-checked:text-lightGrayishBlue peer-checked:line-through dark:peer-checked:text-darkGrayishBlueD sm:text-[18px]">
          {data.title}
        </p>
        <button
          className={
            'pointer-events-auto ml-auto flex-shrink-0 transition-all duration-500 hover:rotate-90 hover:scale-125 group-hover:opacity-100 dark:brightness-125 ' +
            (isTouch ? '' : 'opacity-0')
          }
          title="Remove"
          onClick={handleClick}
        >
          <img
            src="images/icon-cross.svg"
            alt=""
            aria-hidden="true"
            className="aspect-square w-[1.25rem]"
          />
        </button>
      </Reorder.Item>
    </li>
  );
};

export default Todo;
