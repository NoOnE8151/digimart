"use client"
import React, { useState } from 'react'
import { useEffect } from 'react'
import ProductCard from '@/components/marketplace/card'
import { usePathname } from 'next/navigation'

const MarketAll = () => {
  const pathname = usePathname();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname])

  //fetching all products in descending order by sales
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    const res = await fetch('/api/product/getMarketPlace');
    const r = await res.json();
    setProducts(r.products)
  }
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <h1 className='text-2xl p-5'>Featured Products</h1>
    <div className='p-5 grid grid-cols-4 gap-5'>
      {
        products.map((product, idx) => {
          return <ProductCard key={product._id} product={product} />
        })
      }
    </div>
    </>
  )
}

export default MarketAll
