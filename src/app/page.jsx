"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdAdd, IoMdCheckmark } from "react-icons/io";
import { MdDelete, MdFilterList } from "react-icons/md";
import { FaEdit, FaSort } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';

export default function Page() {
  const [todos, setTodos] = useState([]);
  const [id, setId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          status: filter,
          sortBy,
          sortOrder
        });
        
        const request = await axios.get(`/api/todo?${params}`);
        const response = request.data;
        setTodos(response.todo);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [refreshState, filter, sortBy, sortOrder]);

  const handleAdd = () => {
    push('/add');
  };

  const handleDelete = (id) => {
    setIsModalVisible(true);
    setId(id);
  };

  const handleEdit = (id) => {
    push(`/edit/${id}`);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
      const request = await axios.put(`/api/todo/${id}`, { status: newStatus });
      
      if (request.status === 200) {
        toast.success(`Task marked as ${newStatus}`);
        setRefreshState(!refreshState);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update task status');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteTodo = async () => {
    try {
      const request = await axios.delete(`/api/todo/${id}`);
      const response = request.data;
      
      if (request.status === 200) {
        toast.success(response.message);
        setIsModalVisible(false);
        setRefreshState(!refreshState);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    return status === 'done' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getTaskStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.status === 'done').length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getTaskStats();

  return (
    <>
      <Modal isVisible={isModalVisible} onClose={closeModal} handleDelete={handleDeleteTodo}/>
      
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8'>
        <div className='max-w-6xl mx-auto px-4'>
          {/* Header */}
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
              <div>
                <h1 className='font-bold text-3xl lg:text-4xl text-gray-800 mb-2'>Task Manager</h1>
                <div className='flex flex-wrap gap-4 text-sm'>
                  <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full'>
                    Total: {stats.total}
                  </span>
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full'>
                    Completed: {stats.completed}
                  </span>
                  <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full'>
                    Pending: {stats.pending}
                  </span>
                </div>
              </div>
              
              <button 
                className='bg-customPurple hover:bg-purple-700 px-6 py-3 text-white font-semibold rounded-lg flex items-center transition-colors shadow-md'
                onClick={handleAdd}
              >
                <IoMdAdd className='mr-2' size={20}/>
                Add New Task
              </button>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className='bg-white rounded-xl shadow-md p-4 mb-6'>
            <div className='flex flex-col md:flex-row gap-4 items-center'>
              {/* Filter */}
              <div className='flex items-center gap-2'>
                <MdFilterList className='text-gray-600' />
                <label className='text-sm font-medium text-gray-700'>Filter:</label>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-customPurple focus:border-transparent'
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              {/* Sort */}
              <div className='flex items-center gap-2'>
                <FaSort className='text-gray-600' />
                <label className='text-sm font-medium text-gray-700'>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-customPurple focus:border-transparent'
                >
                  <option value="createdAt">Date Created</option>
                  <option value="updatedAt">Last Updated</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className='ml-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors'
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {loading ? (
              <div className='col-span-full flex justify-center items-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-customPurple'></div>
              </div>
            ) : todos.length === 0 ? (
              <div className='col-span-full bg-white rounded-xl shadow-md p-12 text-center'>
                <div className='text-gray-400 text-6xl mb-4'>📝</div>
                <h3 className='text-xl font-semibold text-gray-600 mb-2'>No tasks found</h3>
                <p className='text-gray-500'>Create your first task to get started!</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div 
                  key={todo._id} 
                  className='bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-customPurple'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                      <h3 className={`font-bold text-lg mb-2 ${todo.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.title}
                      </h3>
                      <p className={`text-sm mb-3 ${todo.status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {todo.desc}
                      </p>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(todo.status)}`}>
                      {todo.status}
                    </span>
                  </div>
                  
                  <div className='flex items-center justify-between text-xs text-gray-500 mb-4'>
                    <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    {todo.updatedAt !== todo.createdAt && (
                      <span>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  <div className='flex justify-between items-center'>
                    <button
                      onClick={() => handleToggleStatus(todo._id, todo.status)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        todo.status === 'done' 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      <IoMdCheckmark size={16} />
                      {todo.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(todo._id)}
                        className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors'
                        title='Edit task'
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors'
                        title='Delete task'
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}