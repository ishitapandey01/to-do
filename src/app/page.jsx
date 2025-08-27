"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';

export default function Page() {
  const [todo, setTodo] = useState([]);
  const [id,setId]=useState('')
  console.log('id',id)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refershstate,setRefershstate]=useState(false)
  const { push } = useRouter();
  
  useEffect(() => {
    const Get = async () => {
      try {
        const request = await axios.get("api/todo");
        const response = await request.data;
        setTodo(response.todo);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    Get();
  }, [refershstate]);

  const handleAdd = () => {
    push('add');
  };

  const handleDelete = (id) => {
    setIsModalVisible(true);
    setId(id)
  };

  const handleEdit = (id) => {
    push(`edit/${id}`);
  };

  const closeModal = () => {
    setIsModalVisible(!refershstate);
  };

  const handleDeletetodo=async()=>{
    try {
      try {
        const request=await axios.delete(`/api/todo/${id}`)
        const respone= request.data
        if (request.status==200) {
          toast.success(respone.message)
            setIsModalVisible(false)
           setRefershstate(true)
          
        }
      } catch (error) {
        
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        toast.error(error.response.data.message)
      
      }
    }
  }

  return (
    <>
      <Modal isVisible={isModalVisible} onClose={closeModal} handleDelete={handleDeletetodo}/>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col gap-10 p-8 rounded-lg shadow-xl bg-yellow-200 mt-10 w-2/4'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='font-bold text-3xl'>TODO LIST</h1>
            <button className='rounded-none bg-customPurple px-4 py-2 text-white flex items-center' onClick={handleAdd}>
              Add 
              <IoMdAdd className='ml-2'/>
            </button>
          </div>
          <div className='text-start flex flex-col gap-5'>
            {todo && todo.map((elem) => (
              <div key={elem.id} className='flex justify-between items-center w-full border-b-customPurple border-b-4 rounded-xl p-2'>
                <div className='w-60 flex flex-col gap-1'>
                  <h5 className='font-bold text-1xl'>{elem.title}</h5>
                  <p className='text-sm'>{elem.desc}</p>
                </div>
                <div className='flex flex-col items-center gap-2 justify-center'>
                  <MdDelete size={23} color='red' cursor='pointer' onClick={()=>handleDelete(elem._id)} />
                  <FaEdit size={20} className='text-end' cursor='pointer' onClick={()=>handleEdit(elem._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
