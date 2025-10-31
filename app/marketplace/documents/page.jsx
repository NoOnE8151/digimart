"use client"
import React, { useState } from 'react'
import { useEffect } from 'react'
import ProductCard from '@/components/marketplace/card'
import { usePathname } from 'next/navigation'

const Documents = () => {
  const pathname = usePathname();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname])

  //fetching all products in descending order by sales
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    const res = await fetch('/api/product/getMarketPlace');
    const r = await res.json();
    const documentProducts = r.products.filter(product => product.type === "document");
    setProducts(documentProducts)
  }
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
    <h1 className='text-2xl p-5'>Document Products</h1>
    <div className='md:p-5 p-3 grid md:grid-cols-4 grid-cols-1 gap-5'>
      {
        products.map((product, idx) => {
          return <ProductCard key={product._id} product={product} />
        })
      }
      {products.length === 0 && <div className='py-20 text-lg text-muted-foreground'>
          Nothing to show here
        </div> }
    </div>
    </>
  )
}

export default Documents
