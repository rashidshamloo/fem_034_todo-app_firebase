//react
import { useEffect, useState } from 'react';

// firebase
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
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

// data
import defaultTodo from '../data/defaultTodo.json';

// types
interface todo {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  userId: string;
}

const useTodos = () => {
  // states
  const [todoList, setTodoList] = useState<Array<todo>>([]);
  const [darkMode, setDarkMode] = useState(false);

  // firestore collection ref
  const todosRef = collection(db, 'todos');
  const userPrefRef = collection(db, 'user_preferences');

  useEffect(() => {
    if (!auth.currentUser) return;

    // todo list onSnapshot
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
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [auth.currentUser]);

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
    if (removeTodos)
      todoList.forEach((todo) => {
        const todoRef = doc(todosRef, todo.id);
        batch.delete(todoRef);
      });
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

  // reorders todos
  const ReorderTodos = async (list: todo[]) => {
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

  // sets user dark mode in db
  const setUserDarkMode = async (darkMode: boolean) => {
    if (!auth.currentUser?.uid) return;
    const ref = doc(userPrefRef, auth.currentUser.uid);
    try {
      await setDoc(ref, { darkMode }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  return {
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
  };
};

export default useTodos;
