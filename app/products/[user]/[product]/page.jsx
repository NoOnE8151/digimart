"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const Product = () => {
  const params = useParams();
  const productId = params.product;

  return (
    <div>
      
    </div>
  )
}

export default Product