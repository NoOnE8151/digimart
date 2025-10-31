import React from 'react'

const KYCPending = ({ setKycApprove }) => {
  return (
    <div className='bg-black/50 z-50 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-background flex flex-col items-center w-[50vw] px-10 py-5 rounded-xl gap-5'>
        <h1 className='text-3xl font-bold '>KYC Temporarily Unavailable</h1>
        <p className='text-lg font-semibold'>KYC verification is temporarily unavailable.
Our payment system is currently in testing mode and will be enabled once we receive live access from Razorpay. Please check back soon.</p>
<button onClick={() => setKycApprove(false)} className='bg-element hover:bg-element-hover active:bg-element-active text-white text-lg font-semibold px-5 py-3 rounded-lg cursor-pointer'>Understood</button>
      </div>
    </div>
  )
}

export default KYCPending
