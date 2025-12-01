import React from 'react'
import Link from 'next/link'

const OnboardRequest = ({ setShowOnboardError, setComponentVisibility }) => {
  return (
    <div className='bg-background flex flex-col items-center p-10 gap-5 md:w-[50%] w-[90%] rounded-xl'>
      <h1 className='md:text-3xl text-xl font-bold'>Onboarding Required</h1>
      <p className='md:text-lg text-sm'>Please complete your onboarding before adding a product for sale. Set up your profile and payment details to start selling.</p>
      <div className='flex items-center justify-between w-full px-5'>
        <Link href={'/dashboard/payout'} className='bg-element hover:bg-element-hover active:bg-element-active cursor-pointer text-white font-semibold px-5 py-3 rounded-lg'>Onboard (continue)</Link>
        <button onClick={() => {setShowOnboardError(false); setComponentVisibility(false)}} className='bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-lg cursor-pointer'>Cancel</button>
      </div>
    </div>
  )
}

export default OnboardRequest
