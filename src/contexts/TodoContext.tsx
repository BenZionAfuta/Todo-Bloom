import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string, description?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  activeTodoCount: number;
  completedTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const STORAGE_KEY = "lovable-todos-v2";

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, description?: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const activeTodoCount = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        activeTodoCount,
        completedTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within TodoProvider");
  }
  return context;
};
