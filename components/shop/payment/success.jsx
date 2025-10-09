import React from 'react'
import { ExternalLink, X } from "lucide-react"

const PaymentSuccess = ({ product, setShowPaymentSuccess }) => {
  return (
    <div className='fixed bg-black/60 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-background p-5 rounded-lg flex flex-col gap-5 relative max-w-[40%]'>
        <h1 className='text-2xl font-semibold'>Payment Success</h1>
        <div className='flex items-center gap-3'>
          <img src={product?.thumbnail?.url} alt={product?.title} className='max-h-[10rem] rounded-lg' />
          <div className='max-h-[10rem] flex flex-col gap-2'>
          <h2 className='text-lg font-semibold capitalize'>{product?.title}</h2>
          <p className='h-[8rem] overflow-auto scrollbarHide'>{product?.description}</p>
          </div>
        </div>
        <p className='text-lg'>You have successfully purschased this product</p>
        <a className='bg-element hover:bg-element-hover active:bg-element-active rounded-lg px-3 py-2 text-white font-semibold text-lg flex gap-3 items-center' href="/dashboard/library"><ExternalLink />View in library</a>
        <button onClick={() => setShowPaymentSuccess(false)} className='absolute top-0 right-0 px-5 py-3 cursor-pointer'><X /></button>
      </div>
    </div>
  )
}

export default PaymentSuccess
