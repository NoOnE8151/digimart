"use client"
import React, { useState } from 'react'
import Header from '@/components/header'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Popup from '@/components/ui/popup'

const Library = () => {
    const pathname = usePathname();
      useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname])

      const {user} = useUser();
      const [libraryItems, setLibraryItems] = useState([]);
      const fetchLibrary = async () => {
        const res = await fetch('/api/library/get', {
          'method': 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: user.username })
        });

        const r = await res.json();
        setLibraryItems(r.library);
      }

      useEffect(() => {
        if(!user) {
          return;
        }
        fetchLibrary();
      }, [user])

      useEffect(() => {
        console.log(libraryItems)
      }, [libraryItems])


      // download the product
      const handleDownload = async (productUrl, productTitle) => {
    try {
      console.log(productUrl)
      const response = await fetch(productUrl, {
        mode: "cors",
      });
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${productTitle || "file"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

      
  return (
    <div className='py-14 relative'>
      <Header> </Header>

      <main className='flex items-center justify-center p-5'>
        {libraryItems.length === 0 && <div className='py-20 text-lg text-muted-foreground'>
          Nothing to show here
        </div> }
       <div className="gap-5 grid grid-cols-4">
  {libraryItems.map((product) => {
    return (
      <div
        key={product?._id}
        className="w-full bg-muted shadow-xs border-gray-300 border-[1px] p-5 rounded-lg flex flex-col justify-center items-center gap-3"
      >
        {/* Fixed height container */}
        <div className="w-full h-48 overflow-hidden rounded-lg">
          <img
            src={product?.thumbnail?.url}
            alt={product?.title}
            className="w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-700"
          />
        </div>

        <h2 className="text-lg font-semibold capitalize">{product?.title}</h2>

        <a href={`/${product?.username}`} className='text-muted-foreground underline'>{product?.username}</a>
          
          <button onClick={() => handleDownload(product?.product?.url, product?.title)} className="bg-element text-white rounded-lg font-semibold px-3 py-2 capitalize hover:bg-element-hover active:bg-element-active cursor-pointer w-full text-center">
            download
          </button>
      </div>
    );
  })}
</div>

{/* <div className='absolute'>
<Popup text={'Download started'} />
</div> */}

      </main>
    </div>
  )
}

export default Library
