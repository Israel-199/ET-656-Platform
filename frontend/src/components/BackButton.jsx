import { ArrowLeft, BackpackIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router'

const BackButton = () => {
 const navigate=useNavigate();
  return (
    <div>
        <button onClick={()=>{navigate("/")}} className='btn btn-ghost btn-circle'>
            <ArrowLeft className='h-6 w-6 text-base-content opacity-70'/>
        </button>
    </div>
  )
}

export default BackButton;