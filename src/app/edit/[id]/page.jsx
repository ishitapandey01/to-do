"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { IoArrowBack } from 'react-icons/io5'

export default function EditTaskPage({ params }) {
    const id = params.id
    const { push } = useRouter()
    const [value, setValue] = useState({
        title: "",
        desc: "",
        status: "pending"
    })
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    // Fetch existing task data
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/api/todo/${id}`)
                const task = response.data.todo
                setValue({
                    title: task.title,
                    desc: task.desc,
                    status: task.status
                })
            } catch (error) {
                console.log(error)
                toast.error('Failed to load task data')
                push('/')
            } finally {
                setInitialLoading(false)
            }
        }

        if (id) {
            fetchTask()
        }
    }, [id, push])

    const handleOnchange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!value.title.trim() || !value.desc.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            setLoading(true)
            const request = await axios.put(`/api/todo/${id}`, value)
            const response = request.data
            
            if (request.status === 200) {
                toast.success(response.message)
                push('/')
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        push('/')
    }

    if (initialLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-customPurple mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading task...</p>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8'>
            <div className='max-w-2xl mx-auto px-4'>
                {/* Header */}
                <div className='mb-8'>
                    <button 
                        onClick={handleBack}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors'
                    >
                        <IoArrowBack size={20} />
                        <span>Back to Tasks</span>
                    </button>
                    <h1 className='text-3xl font-bold text-gray-800'>Edit Task</h1>
                    <p className='text-gray-600 mt-2'>Update your task details</p>
                </div>

                {/* Form */}
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Title */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Task Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={value.title}
                                onChange={handleOnchange}
                                placeholder="Enter task title..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customPurple focus:border-transparent transition-colors"
                                maxLength={100}
                            />
                            <div className='text-right text-sm text-gray-500 mt-1'>
                                {value.title.length}/100
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Description *
                            </label>
                            <textarea
                                name="desc"
                                value={value.desc}
                                onChange={handleOnchange}
                                placeholder="Enter task description..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customPurple focus:border-transparent transition-colors resize-none"
                                maxLength={500}
                            />
                            <div className='text-right text-sm text-gray-500 mt-1'>
                                {value.desc.length}/500
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Task Status
                            </label>
                            <select
                                name="status"
                                value={value.status}
                                onChange={handleOnchange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customPurple focus:border-transparent transition-colors"
                            >
                                <option value="pending">Pending</option>
                                <option value="done">Completed</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-4 pt-4'>
                            <button
                                type="button"
                                onClick={handleBack}
                                className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className='flex-1 px-6 py-3 bg-customPurple hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {loading ? 'Updating...' : 'Update Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
  }