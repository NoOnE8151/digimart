'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/marketplace/card'

const Search = () => {
    const params = useParams();
    const searchInput = decodeURIComponent(params.searchInput);
    const [products, setProducts] = useState([]);

    const handleSearch = async () => {
      const res = await fetch('/api/marketplace/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchInput })
      })
      const r = await res.json();
      setProducts(r.products)
    }
    
    useEffect(() => {
        if(searchInput) {
            handleSearch();
        }
    }, [searchInput]);
    
  return (
    <>
    <h1 className='text-2xl p-5'>Search results for <b>{searchInput}</b></h1>
    <div className='p-5 grid grid-cols-4 gap-5'>
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

export default Search
