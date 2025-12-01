import React from 'react'

const Popup = ({text}) => {
  return (
    <div className='popup'>
      <p className='bg-gray-700 rounded-full px-5 py-3 text-white font-semibold absolute bottom-[10rem] w-auto'>{text}</p>
    </div>
  )
}

export default Popup
