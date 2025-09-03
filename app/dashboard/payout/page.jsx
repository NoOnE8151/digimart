"use client"
import React, { useEffect, useState } from 'react'
import OnboardingForm from '@/components/dashboard/payout/onboard/form';
import { useUser } from '@clerk/nextjs';

const Payout = () => {
  const [isOnboardFormOpen, setIsOnboardFormOpen] = useState(false);
  const [subMerchant, setSubMerchant] = useState({});

  const {user} = useUser();

  //fetching submerchant
  const [isSubMerchantFetching, setIsSubMerchantFetching] = useState(false);
  const fetchSubMerchant = async () => {
     setIsSubMerchantFetching(true);
    const res = await fetch('/api/razorpay/getSubMerchant', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user?.username })
    })
    const r = await res.json();
    setSubMerchant(r.subMerchant);
     setIsSubMerchantFetching(false);
    return;
  }

  useEffect(() => {
    fetchSubMerchant();
  }, [user])

  useEffect(() => {
    console.log('submerchant is here', subMerchant)
  }, [subMerchant])
  
  return (
    <div className='grid justify-items-start gap-3 h-full relative px-[7rem] py-[6rem]'>
        <div className='flex flex-col gap-5 w-full'> 
      <h1 className='text-2xl font-semibold'>Payouts</h1>
      <div className='bg-muted w-full flex justify-between p-8 rounded-lg shadow'>
        <div className='flex flex-col'>
        <span>Available to withdraw</span>
        <span className='text-3xl font-bold'>₹0.00</span>
        </div>
        {!subMerchant && !isSubMerchantFetching && <button onClick={() => setIsOnboardFormOpen(true)} className='bg-element text-white font-semibold max-h-[3rem] px-5 rounded-xl cursor-pointer'>Link Account</button>}
        {subMerchant && <button className='bg-element text-white font-semibold max-h-[3rem] px-5 rounded-xl cursor-pointer'>Withdraw</button>}
        
      </div>
        </div>

        {isOnboardFormOpen && <OnboardingForm setIsOnboardFormOpen={setIsOnboardFormOpen} />}
    </div>
  )
}

export default Payout
