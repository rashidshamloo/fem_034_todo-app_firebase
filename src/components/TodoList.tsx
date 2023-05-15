// react
import { useRef } from 'react';

// framer motion
import { Reorder, AnimatePresence, motion } from 'framer-motion';

// react-responsive
import { useMediaQuery } from 'react-responsive';

// components
import Todo from './Todo';
import Filter from './Filter';

// types
import { filter, todo } from '../App';

interface todoListProps {
  todoList: Array<todo>;
  filter: filter;
  setFilter: React.Dispatch<React.SetStateAction<filter>>;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearCompleted: () => void;
  handleReorder: (todoList: Array<todo>) => void;
}

const TodoList = ({
  todoList,
  filter,
  setFilter,
  removeTodo,
  toggleTodo,
  clearCompleted,
  handleReorder,
}: todoListProps) => {
  const ref = useRef<HTMLUListElement>();

  // items left
  const itemsLeft = todoList.reduce(
    (acc, curr) => (!curr.completed ? ++acc : acc),
    0
  );

  // media query to change filter location
  const matches = useMediaQuery({ query: '(min-width: 600px)' });

  return (
    <AnimatePresence>
      {todoList.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              marginTop: todoList.length > 0 ? '1.5rem' : 0,
            }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden rounded-md bg-white shadow-[0_0.35rem_1rem] shadow-[rgba(0,0,0,0.15)] transition-[background-color] duration-500 dark:bg-veryDarkGrayishBlueD2 "
          >
            <Reorder.Group
              axis="y"
              values={todoList}
              onReorder={handleReorder}
              className={'' + filter === 'all' ? 'cursor-grab' : ''}
              ref={ref}
            >
              <AnimatePresence>
                {todoList.map((item) => {
                  if (
                    filter === 'all' ||
                    (filter === 'completed' && item.completed) ||
                    (filter === 'active' && !item.completed)
                  ) {
                    return (
                      <Todo
                        key={item.id}
                        data={item}
                        removeTodo={removeTodo}
                        toggleTodo={toggleTodo}
                        containerRef={ref}
                        listFilter={filter}
                      />
                    );
                  }
                })}
              </AnimatePresence>
            </Reorder.Group>
            <motion.div
              layout
              className={
                'grid h-16 place-content-center rounded-md bg-white px-4 text-[14px] text-darkGrayishBlue transition-[background-color] duration-500 dark:bg-veryDarkGrayishBlueD2 dark:text-darkGrayishBlueD [&_button]:transition-[color] [&_button]:duration-500 hover:[&_button]:text-veryDarkGrayishBlue dark:hover:[&_button]:text-lightGrayishBlueHover ' +
                (matches ? 'grid-cols-3' : 'grid-cols-2')
              }
            >
              <p>
                <span>{itemsLeft}</span> item{itemsLeft !== 1 && 's'} left
              </p>
              {matches && <Filter filter={filter} setFilter={setFilter} />}
              <div className="text-right">
                <button onClick={clearCompleted}>Clear Completed</button>
              </div>
            </motion.div>
          </motion.div>
          {!matches && (
            <motion.div
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              key="filter"
              className="mt-5 flex h-16 items-center justify-center rounded-md bg-white text-lg shadow-[0_0.35rem_1rem] shadow-[rgba(0,0,0,0.15)] transition-[background-color] duration-500 dark:bg-veryDarkGrayishBlueD2"
            >
              <Filter filter={filter} setFilter={setFilter} />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default TodoList;
