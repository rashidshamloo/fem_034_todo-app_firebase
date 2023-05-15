//react
import { useEffect, useRef, useState } from 'react';

// firebase
import { auth } from './config/firebase';
import { db } from './config/firebase';
import {
  collection,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  orderBy,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

// components
import Header from './components/Header';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// data
import defaultTodo from './data/defaultTodo.json';

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
  // firestore collection ref
  const todosRef = collection(db, 'todos');
  const userPrefRef = collection(db, 'user_preferences');

  // states
  const [darkMode, setDarkMode] = useState(false);
  const [todoList, setTodoList] = useState<Array<todo>>([]);
  const [filter, setFilter] = useState<filter>('all');
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);

  // container ref used for focus trapping in AuthModal
  const containerRef = useRef<HTMLDivElement>(null);

  // Todo List / db modify functions

  // deletes current todos from db
  const deleteCurrentTodos = async () => {
    const batch = writeBatch(db);
    todoList.forEach((todo) => {
      const todoRef = doc(todosRef, todo.id);
      batch.delete(todoRef);
    });
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  // deletes user preferences from db
  const deleteUserPref = async (userId: string) => {
    try {
      const prefDoc = doc(userPrefRef, userId);
      await deleteDoc(prefDoc);
    } catch (e: any) {
      console.error(e);
    }
  };

  // resets the current todo list
  const resetTodoList = async (removeTodos = false) => {
    const batch = writeBatch(db);
    // delete current todos from db
    if (removeTodos) deleteCurrentTodos();
    // add default todos to db
    defaultTodo.forEach((todo, index) => {
      const newTodoRef = doc(todosRef);
      batch.set(newTodoRef, {
        ...todo,
        userId: auth.currentUser?.uid,
        order: index,
      });
    });
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  // adds todo to db
  const addTodo = async (title: string, completed: boolean) => {
    const itemToAdd: Partial<todo> = {
      title,
      completed,
      userId: auth.currentUser?.uid,
      order: 0,
    };
    const batch = writeBatch(db);
    // increase order of all user todo items by one
    // to make room for the new todo and add it to the top
    for (const todoItem of todoList) {
      const todoDoc = doc(todosRef, todoItem.id);
      batch.update(todoDoc, { ...todoItem, order: ++todoItem.order });
    }
    // add new todo
    batch.set(doc(todosRef), itemToAdd);
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  // deletes todo from db
  const removeTodo = async (id: string) => {
    try {
      const todoDoc = doc(todosRef, id);
      await deleteDoc(todoDoc);
    } catch (e: any) {
      console.error(e);
    }
  };

  // toggles todo's completed property
  const toggleTodo = async (id: string) => {
    try {
      const todoDoc = doc(todosRef, id);
      const todo = todoList.find((item) => item.id === id);
      await updateDoc(todoDoc, { ...todo, completed: !todo!.completed });
    } catch (e: any) {
      console.error(e);
    }
  };

  // removes completed todos from db
  const clearCompleted = async () => {
    const batch = writeBatch(db);
    for (const todoItem of todoList) {
      const todoDoc = doc(todosRef, todoItem.id);
      if (todoItem.completed) batch.delete(todoDoc);
    }
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  // handle events
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key === 'Z') {
      resetTodoList(true);
    }
  };

  const handleReorder = async (list: todo[]) => {
    const batch = writeBatch(db);
    list.forEach((todoItem, index) => {
      const todoDoc = doc(db, 'todos', todoItem.id);
      batch.update(todoDoc, { order: index });
    });
    try {
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  const onToggle = async () => {
    if (!auth.currentUser?.uid) return;
    const ref = doc(userPrefRef, auth.currentUser.uid);
    try {
      await setDoc(ref, { darkMode: !darkMode }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  // login anonymously and populate default todos
  const setupAnonymousUser = async () => {
    try {
      const result = await auth.signInAnonymously();
      // if it's a new user populate todos
      result.additionalUserInfo?.isNewUser && resetTodoList();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isLoggedin || !auth.currentUser) return;

    // todo listonSnapshot
    const unsubscribe1 = onSnapshot(
      query(
        todosRef,
        where('userId', '==', auth.currentUser.uid),
        orderBy('order')
      ),
      (snap) => {
        const tempTodoList = snap.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            } as todo)
        );
        setTodoList(tempTodoList);
      }
    );
    // darkMode onSnapshot
    const unsubscribe2 = onSnapshot(
      doc(userPrefRef, auth.currentUser.uid),
      (snap) => {
        if (!snap.data()?.darkMode) {
          setDarkMode(false);
          document.body.classList.remove('dark');
        } else {
          setDarkMode(true);
          document.body.classList.add('dark');
        }
      }
    );
    // enable transitions after page load
    document.body.classList.remove('[&>div]:!transition-none');
    // add "shift+z" keyDown handler
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unsubscribe1();
      unsubscribe2();
    };
  }, [auth.currentUser]);

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
