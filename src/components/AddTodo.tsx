// react
import { useState } from 'react';

// icons
import { FaPlus } from 'react-icons/fa';

// types
interface addTodoProps {
  addTodo: (title: string, completed: boolean) => void;
}
const AddTodo = ({ addTodo }: addTodoProps) => {
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);

  // handle events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableSubmit(!(e.target.value.trim() === ''));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnableSubmit(false);
    const inputElement = (e.target as HTMLFormElement).elements.namedItem(
      'todo'
    ) as HTMLInputElement;
    const title = inputElement?.value.trim();
    if (title === '') return;
    const completedElement = (e.target as HTMLFormElement).elements.namedItem(
      'completed'
    ) as HTMLInputElement;
    // add todo and completed
    const completed = completedElement.checked;
    // insert into db
    addTodo(title, completed);
    // reset elements
    inputElement.value = '';
    completedElement.checked = false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex h-16 w-full items-center justify-center gap-x-6 rounded-md bg-white px-6 shadow-xl transition-all duration-500 dark:bg-veryDarkGrayishBlueD2">
        <input
          id="add-todo"
          type="checkbox"
          name="completed"
          className="peer sr-only"
          aria-label="Toggle Completed"
        />
        <label
          htmlFor="add-todo"
          className="relative flex aspect-square w-[1.9rem] items-center justify-center rounded-full bg-lightGrayishBlue transition-[background-color] duration-500 peer-checked:bg-check peer-enabled:cursor-pointer peer-enabled:hover:bg-check dark:bg-veryDarkGrayishBlueD1 [&>img]:opacity-0 peer-checked:[&>img]:opacity-100 [&>span]:bg-white peer-checked:[&>span]:bg-transparent dark:[&>span]:bg-veryDarkGrayishBlueD2"
        >
          <span className="absolute inset-[1px] rounded-full transition-[background-color] duration-500 "></span>
          <img src="images/icon-check.svg" aria-hidden="true" alt="" />
        </label>
        <input
          type="text"
          name="todo"
          aria-label="New Todo Item"
          placeholder="Create a new todo..."
          className="h-full w-full bg-transparent text-[16px] outline-0 transition-all duration-500 placeholder:text-lightGrayishBlueD placeholder:transition-all placeholder:duration-500 peer-checked:text-lightGrayishBlue peer-checked:line-through dark:placeholder:text-darkGrayishBlueD dark:peer-checked:text-darkGrayishBlueD dark:peer-checked:placeholder:text-darkGrayishBlueD sm:text-[18px]"
          onChange={handleChange}
        />
        <button
          className={
            'text-xl text-green-500/50 transition-all duration-500 hover:scale-110 hover:text-green-500/80 ' +
            (enableSubmit ? '' : 'opacity-0')
          }
          aria-hidden={!enableSubmit}
          disabled={!enableSubmit}
          title="Add"
        >
          <FaPlus />
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
