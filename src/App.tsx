//react
import { useEffect, useRef, useState } from 'react';

// custom hook
import useTodos from './hooks/useTodos';
import useAuth from './hooks/useAuth';

// components
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// types
export type filter = 'all' | 'active' | 'completed';
export interface todo {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  userId: string;
}

const App = () => {
  // states
  const [filter, setFilter] = useState<filter>('all');
  const [showAuth, setShowAuth] = useState<boolean>(false);

  // custom hooks
  const {
    todoList,
    darkMode,
    deleteUserPref,
    resetTodoList,
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    setUserDarkMode,
    ReorderTodos,
    deleteCurrentTodos,
  } = useTodos();
  const { isLoggedin, signOut } = useAuth(resetTodoList);

  // container ref used for focus trapping in AuthModal
  const containerRef = useRef<HTMLDivElement>(null);

  // handle events
  const handleReorder = (list: todo[]) => {
    ReorderTodos(list);
  };
  const onToggle = () => {
    setUserDarkMode(!darkMode);
  };

  useEffect(() => {
    // enable transitions after page load
    document.body.classList.remove('[&>div]:!transition-none');
  }, []);

  return (
    <>
      <AuthModal
        show={showAuth}
        setShow={setShowAuth}
        resetTodoList={resetTodoList}
        deleteCurrentTodos={deleteCurrentTodos}
        deleteUserPref={deleteUserPref}
        containerRef={containerRef}
      />
      <div className="mx-auto w-full sm:max-w-[33.75rem]" ref={containerRef}>
        <Header
          darkMode={darkMode}
          onToggle={onToggle}
          setShowAuth={setShowAuth}
          signOut={signOut}
          isLoggedin={isLoggedin}
        />
        <main className="mx-[6%] mt-6 sm:mx-0 sm:mt-8">
          <AddTodo addTodo={addTodo} />
          <TodoList
            todoList={todoList}
            handleReorder={handleReorder}
            filter={filter}
            setFilter={setFilter}
            removeTodo={removeTodo}
            toggleTodo={toggleTodo}
            clearCompleted={clearCompleted}
          />
        </main>
        <Footer
          show={todoList.length > 0}
          resetTodoList={resetTodoList}
          filter={filter}
        />
      </div>
    </>
  );
};

export default App;
