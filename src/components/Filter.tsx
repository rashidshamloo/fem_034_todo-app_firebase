// framer motion
import { motion } from 'framer-motion';

// types
import { filter } from '../App';

interface filterProps {
  filter: filter;
  setFilter: React.Dispatch<React.SetStateAction<filter>>;
}

const Filter = ({ filter, setFilter }: filterProps) => {
  return (
    <motion.div
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-between gap-x-4 font-bold text-darkGrayishBlue dark:text-darkGrayishBlueD"
    >
      <button
        className={filter === 'all' ? 'text-brightBlue' : ''}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        className={filter === 'active' ? 'text-brightBlue' : ''}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        className={filter === 'completed' ? 'text-brightBlue' : ''}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </motion.div>
  );
};

export default Filter;
