"use client"
import React from 'react'
import { useEffect } from 'react'
import ProductCard from '@/components/marketplace/card'
import { usePathname } from 'next/navigation'

const MarketAll = () => {
  const pathname = usePathname();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname])

  const produtc1 = {
    title: "Test Product",
    username: 'noone',
    price: 690,
    thumbnail: {
      url: '/assets/test.jpg'
    }
  }
  return (
    <>
    <h1 className='text-2xl p-5'>Featured Products</h1>
    <div className='p-5 grid grid-cols-4 gap-5'>
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
      <ProductCard product={produtc1} />
    </div>
    </>
  )
}

export default MarketAll
