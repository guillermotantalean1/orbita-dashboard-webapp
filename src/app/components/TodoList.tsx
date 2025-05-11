'use client';

import React, { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'test' | 'career' | 'education' | 'other';
  dueDate?: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Completar Test de Ambiente de Trabajo',
      completed: false,
      priority: 'high',
      category: 'test',
      dueDate: '2025-05-15'
    },
    {
      id: '2',
      text: 'Investigar carreras relacionadas con Tecnología',
      completed: false,
      priority: 'medium',
      category: 'career',
      dueDate: '2025-05-20'
    },
    {
      id: '3',
      text: 'Revisar resultados del Test de Valores Personales',
      completed: true,
      priority: 'low',
      category: 'test'
    },
    {
      id: '4',
      text: 'Contactar orientador vocacional',
      completed: false,
      priority: 'medium',
      category: 'education',
      dueDate: '2025-05-25'
    }
  ]);

  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState<'test' | 'career' | 'education' | 'other'>('other');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate || undefined
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setNewPriority('medium');
    setNewCategory('other');
    setNewDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'test': return '🚀';
      case 'career': return '💼';
      case 'education': return '🎓';
      default: return '📝';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Tareas de Misión</h1>
      
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl mb-8">
        <form onSubmit={addTodo} className="mb-6">
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              placeholder="Nueva tarea de misión..."
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prioridad</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as 'test' | 'career' | 'education' | 'other')}
                  className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="test">Test</option>
                  <option value="career">Carrera</option>
                  <option value="education">Educación</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha límite</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full md:w-auto md:self-end px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Añadir Tarea
            </button>
          </div>
        </form>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Completadas
            </button>
          </div>
          
          <div className="text-sm text-gray-400">
            {todos.filter(t => !t.completed).length} tareas pendientes
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-gray-500 text-6xl mb-4">🌠</div>
              <p className="text-gray-400">No hay tareas en esta categoría</p>
              <p className="text-gray-500 text-sm mt-2">¡La galaxia está esperando tus nuevas misiones!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all ${
                  todo.completed ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        todo.completed
                          ? 'bg-indigo-600 border-indigo-400 text-white'
                          : 'border-gray-500 hover:border-indigo-500'
                      }`}
                    >
                      {todo.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)} border`}>
                        {todo.priority === 'high' ? 'Alta' : todo.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-500/30">
                        {getCategoryIcon(todo.category)} {todo.category === 'test' ? 'Test' : todo.category === 'career' ? 'Carrera' : todo.category === 'education' ? 'Educación' : 'Otro'}
                      </span>
                      
                      {todo.dueDate && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          🗓️ {formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-white ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.text}</p>
                  </div>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border border-blue-500/20 shadow-xl">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center">
          <span className="text-blue-400 mr-2">💡</span>
          Consejos para tu Exploración Vocacional
        </h3>
        
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
              1
            </div>
            <p>Completa todos los tests para obtener una visión más completa de tus intereses y habilidades.</p>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
              2
            </div>
            <p>Revisa tus resultados anteriores para identificar patrones en tus preferencias.</p>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
              3
            </div>
            <p>Investiga las carreras recomendadas antes de tomar decisiones importantes.</p>
          </li>
          <li className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3 mt-0.5">
              4
            </div>
            <p>Contacta con un orientador vocacional para recibir asesoramiento personalizado.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TodoList; 