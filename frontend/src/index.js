import React from 'react';
import ReactDOM from 'react-dom/client';
import TodoList from './components/TodoList';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TodoList />
  </React.StrictMode>
);

reportWebVitals();
