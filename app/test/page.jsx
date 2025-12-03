"use client"
import React from 'react'

const page = () => {

  const testFnc = async () => { 
    await fetch("/api/razorpay/onboard/deleteAccount", { method: "DELETE" });
   }
  return (
    <div>

        <h1>Test Page</h1>
        <button onClick={testFnc} className='bg-blue-500 p-5 rounded-2xl'>click to test</button>

    </div>
  )
}

export default page