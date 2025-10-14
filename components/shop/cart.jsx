"use client";
import React, { useEffect, useState } from 'react'
import {X} from "lucide-react"
import { useUser } from '@clerk/nextjs';

const Cart = ({ setIsCartOpen, setIsCartClosing, cartItems, getTotalPrice, fetchCart, fetchProduct }) => {
  const { user } = useUser();

  const handleRemoveCartItem = async (cartProductId) => {
    const res = await fetch('/api/shop/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartProductId, username: user.username })
        })
        const r = await res.json();
        fetchCart(user.username);
        fetchProduct();
  }

  //create order for multiple products
  
  
  return (
    <div className='bg-background absolute right-0 w-[25%] top-0 h-full p-5 flex flex-col gap-3 overflow-y-auto'>
        <div className='flex items-center justify-between px-5'>
      <h1 className='font-semibold text-lg text-center'>Your Cart</h1>
      <button onClick={() => {
        setIsCartClosing(true);
        setTimeout(() => {
          setIsCartOpen(false);
          setIsCartClosing(false);
        }, 500);
      }} className='cursor-pointer'><X/></button>
        </div>
      <hr />

      <div className='flex flex-col gap-3'>
        {cartItems?.map((product, idx) => {
          return <div key={product._id}>
      <div className='flex items-center w-full gap-3'>
        <div className='w-1/3 p-3'><img src={product.thumbnail.url} alt="featured image" className='rounded-lg' /></div>
        <div className='w-1/3 flex flex-col '>
            <a href={'#'} className='font-semibold'>{product.title}</a>
            <div>₹{product.price}</div>
        </div>
        <div className='w-1/3  flex justify-center'>
            <button onClick={() => handleRemoveCartItem(product._id)} className='text-muted-foreground underline text-xs cursor-pointer hover:text-muted-foreground/70'>Remove</button>
        </div>
      </div>
          </div>  
      })}
      <hr />
      <div className='flex items-center justify-between px-3 font-semibold'>
        <div>Total</div>
        <div>₹{getTotalPrice()}</div>
      </div>

      </div>

      <hr />
      <button className='bg-element text-white font-semibold px-5 py-3 rounded'>Checkout</button>
    </div>
  )
}

export default Cart
