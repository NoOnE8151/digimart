"use client"
import React, { useEffect, useState } from 'react'
import OnboardingForm from '@/components/dashboard/payout/onboard/form';
import { useUser } from '@clerk/nextjs';
import KYCPending from '@/components/dashboard/payout/kycPending';
import PreKycUI from '@/components/dashboard/payout/onboard/kyc/kyc';

const Payout = () => {
  const [isOnboardFormOpen, setIsOnboardFormOpen] = useState(false);
  const [subMerchant, setSubMerchant] = useState({});

  const { user } = useUser();

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

  const [kycApprove, setKycApprove] = useState(false); //placeholder state 

  const [isPreKycUiShowing, setIsPreKycUiShowing] = useState(false);

  const handleKYC = async () => {
    setIsPreKycUiShowing(true);
    return;
  }

  return (
    <div className='grid justify-items-start gap-3 h-full w-full relative px-5 md:px-[7rem] py-[6rem]'>
      <div className='flex flex-col gap-5 w-full'>
        <h1 className='text-2xl font-semibold'>Payouts</h1>
        <div className='bg-muted w-full flex flex-col md:flex-row gap-5 justify-between p-8 rounded-lg shadow'>
          <div className='flex justify-center items-center md:items-start gap-3 flex-col'>
            <span className='text-lg font-semibold'>Total Earnings this month</span>
            <span className='text-3xl font-bold'>₹0.00</span>
          </div>
          {!subMerchant && !isSubMerchantFetching && <button onClick={() => setIsOnboardFormOpen(true)} className='bg-element text-white font-semibold max-h-[3rem] px-5 rounded-xl cursor-pointer hover:bg-element-hover active:bg-element-active'>Link Account</button>}
          {subMerchant.kycStatus === 'pending' && !isSubMerchantFetching && <button onClick={handleKYC} className='bg-element text-white font-semibold max-h-[3rem] px-5 md:py-0 py-3 rounded-xl cursor-pointer hover:bg-element-hover active:bg-element-active'>Complete KYC</button>}
        </div>

        {subMerchant.kycStatus === 'pending' && !isSubMerchantFetching && (
          <p>
            You can continue receiving payments, but withdrawals to your bank account will only be enabled after completing your KYC. Click the “Complete KYC” button to proceed.
          </p>
        )}


        {subMerchant.kycStatus === 'approved' && !isSubMerchantFetching && (
          <p>
            Your earnings will be automatically settled to your linked bank account within 7 days of each transaction.
          </p>
        )}


      </div>

      {kycApprove && <KYCPending setKycApprove={setKycApprove} />}

      {isOnboardFormOpen && <OnboardingForm setIsOnboardFormOpen={setIsOnboardFormOpen} />}

      {isPreKycUiShowing && <PreKycUI setIsPreKycUiShowing={setIsPreKycUiShowing} subMerchant={subMerchant} />}
    </div>
  )
}

export default Payout
