import React from 'react'

const Payout = () => {
  return (
    <div className='grid justify-items-start gap-3 h-full relative px-[7rem] py-[6rem]'>
        <div className='flex flex-col gap-5 w-full'> 
      <h1 className='text-2xl font-semibold'>Payouts</h1>
      <div className='bg-muted w-full flex justify-between p-8 rounded-lg shadow'>
        <div className='flex flex-col'>
        <span>Available to withdraw</span>
        <span className='text-3xl font-bold'>₹0.00</span>
        </div>
        <button className='bg-element text-white font-semibold max-h-[3rem] px-5 rounded-xl cursor-pointer'>Add a payout method</button>
      </div>
        </div>
    </div>
  )
}

export default Payout
