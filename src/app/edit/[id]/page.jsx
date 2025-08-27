"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function page({params}) {
  const id=params.id
    const {push}=useRouter()
    const [value,setValue]=useState({
        title:"",
        desc:""
    })
    const handleOnchange=(e)=>{
        setValue({
            ...value,
            [e.target.name]:e.target.value
        })
    }
    const handleSubmit=async()=>{
        try {
          if (id) {
            const request=await axios.put(`/api/todo/${id}`,value)
            const response= request.data
            if (request.status==200) {
              toast.success(response.message)
                
                push('/')
              
            }
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
      <div className='flex justify-center  h-screen'>
             <div className='mt-8 flex gap-8 flex-col p-10 rounded-lg h-80 shadow-lg bg-customPurple'>
                <h1 className='text-white font-bold text-2xl'>Update Todo</h1>
             <label class="relative block">
  {/* <span class="text-white text-lg mb-20 mt-20 ">Tittle</span> */}
  <span class="absolute inset-y-0 left-0 flex items-center pl-2">
   
  </span>
  <input   class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter you title" type="text" 
   value={value.title} name='title'  onChange={handleOnchange} />
</label>
<label class="relative block">
  {/* <span class="text-white text-lg mb-20 mt-20 ">Tittle</span> */}
  <span class="absolute inset-y-0 left-0 flex items-center pl-2">
   
  </span>
  <input value={ value.desc} name='desc' onChange={handleOnchange} class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter you description" type="text"/>
</label>

   <button className='rounded-lg bg-green-500 px-4 py-2 text-white font-bold  ' onClick={handleSubmit}>Submit</button>
             </div>
      </div>
   
   
   </>
  )
}
