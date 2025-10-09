import React from 'react'
import { Search } from 'lucide-react'

const Header = () => {
  return (
    <div>
      <header className='px-7 py-3 flex items-center gap-3 justify-between'>
        <a href="/dashboard" className='flex items-center'>
        <img src="/assets/logo/logo.png" alt="logo" className='w-[4rem]' />
        <h1 className='text-2xl font-semibold'>Digimart</h1>
        </a>

        <div className='flex items-center gap-3 border-border border-2 shadow-2xs rounded-full px-5 py-2 w-1/2'> <Search className='text-gray-600' /> <input type="text" placeholder={`Search products`} className='outline-none' /></div>
      </header>
    </div>
  )
}

export default Header
