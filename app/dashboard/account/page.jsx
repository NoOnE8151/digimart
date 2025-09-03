'use client'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'

const Account = () => {
  const { user, isLoaded } = useUser();

  //checking if user is logged in using google oauth or email pass method
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);  
  useEffect(() => {
    if(isLoaded && user) {
        if(user?.emailAddresses[0]?.linkedTo[0]?.type === 'oauth_google') {
            setIsGoogleLoggedIn(true);
        }
    }
  }, [isLoaded, user])

  //if login method is googl then this handle to show "edit username" text on hover on username input
  const [showEditUsernameText, setShowEditUsernameText] = useState(false);
  const handleShowEditUsernameText = () => {
    setShowEditUsernameText(true);
  }

  const handleHideEditUsernameText = () => {
    setShowEditUsernameText(false);
  }
  
  //if login method is google then edit username 
  const [isUsernameEditing, setIsUsernameEditing] = useState(false);
  const toggleUsernameEdit = () => {
    console.log('i got clicked')
    setIsUsernameEditing(true);
  }
  
  useEffect(() => {
    console.log(isUsernameEditing)
  }, [isUsernameEditing])

  //form to edit personal informations
  const {
    handleSubmit: handleSubmitInfo,
    register: registerInfo,
    reset: resetInfo,
    formState: { infoErrors }
  } = useForm({
    defaultValues: {
        username: user?.username,
        email: user?.primaryEmailAddress?.emailAddress,
    }
  });

  //reset form when user is loaded this prevent inputs from being empty on initial render
  useEffect(() => {
    if (isLoaded && user) {
      resetInfo({
        username: user.username || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
        console.log(user)
  }, [isLoaded, user, resetInfo]);

  //handling form editing
  const [isInfoEditing, setIsInfoEditing] = useState(false);

  return (
    <div className="grid grid-cols-1 grid-rows-3 gap-14 h-full px-14 py-[6rem]">
      <div className='w-full flex flex-col gap-7'>
        <div className='flex items-center justify-between w-[70%]'>
        <h1 className='text-3xl font-bold'>Your Account</h1>  
        {/* button to toggle editing for email password login method */}
        {!isInfoEditing && !isGoogleLoggedIn && <button onClick={() => setIsInfoEditing(true)} className='bg-element text-white font-semibold rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active px-7 py-2'>Edit Info</button>}
        
        {/* button to save or cancel info editing for email password login method */}
       {isInfoEditing && <div className='flex items-center gap-3'>
        <button className='bg-element text-white font-semibold rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active px-7 py-2'>Save Changes</button>
        <button onClick={() => setIsInfoEditing(false)} className='border-destructive/40 border-2 text-destructive/60 hover:bg-destructive hover:text-white font-semibold rounded-lg cursor-pointer px-7 py-2'>Cancel</button>
        </div>}
        
        {/* button to save username (updated changes) for google login method */}
        {isGoogleLoggedIn && isUsernameEditing && <button type='button' className='bg-element text-white px-5 py-2 rounded-sm w-fit'>Save Changes</button>}

        </div>
        <form className='w-[70%] flex flex-col gap-5'>
            <div className='flex flex-col gap-3 relative'>
                <label className='font-semibold text-lg'>Username</label>
                 
                 {/* username input for google login method */}
                 <div onClick={toggleUsernameEdit} onMouseEnter={handleShowEditUsernameText} onMouseLeave={handleHideEditUsernameText}>
                    {!isUsernameEditing && <div className={`${ isGoogleLoggedIn && !isUsernameEditing ? 'hover:border-element hover:border-[4px] cursor-pointer hover:pb-3' : 'border-border cursor-text'} border-2 rounded-sm px-3 py-2 w-full`}>
                        {user?.username}
                    </div>}
                {isUsernameEditing && <input type="text" autoFocus
                className={`${ isGoogleLoggedIn && !isUsernameEditing ? 'hover:border-element hover:border-[4px] cursor-pointer hover:pb-3' : 'border-border cursor-text'} border-2 rounded-sm px-3 py-2 w-full`} />}
                {showEditUsernameText && isGoogleLoggedIn && !isUsernameEditing && <div className='bg-element text-white w-fit text-xs px-5 rounded-bl-lg rounded-tr-lg absolute bottom-0 '>Click to Edit Username</div>}
                </div>

                {/* username input for email passwsord login method */}
                { !isGoogleLoggedIn && <input type="text" disabled={!isInfoEditing}
                 className='border-2 border-border rounded-sm px-3 py-2 cursor-text'
                {...registerInfo('username', {
                    maxLength: {value: 200, message: 'maximum character limit for username is 200'}
                })} />}

            </div>

            <div className='flex flex-col gap-3'>
                <label className='font-semibold text-lg'>Email</label>
                <input type="email" disabled={!isInfoEditing}
                className='border-2 border-border rounded-sm px-3 py-2 cursor-text'
                {...registerInfo('email', {
                    maxLength: { value: 200, message: "maximum character limit for email is 200" }
                })} />
            </div>

            <div className='flex flex-col gap-3'>
                <label className='font-semibold text-lg'>Phone</label>
                <input type="number" disabled={!isInfoEditing} placeholder={isInfoEditing ? 'Enter phone number' : 'Phone number not entered'}
                className='border-2 border-border rounded-sm px-3 py-2 cursor-text'
                {...registerInfo('phone', {
                    minLength: { value: 8, message: "minimum integer limit for phone number is 8" },
                    maxLength: { value: 10, message: "maximum integer limit for phone number is 10" }
                })} />
            </div>
            
        </form>
      </div>

      <div className='flex flex-col gap-5'>
        <h2 className='text-2xl font-bold'>Change Password</h2>

          <form className='w-[70%] flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
                <label className='font-semibold text-lg'>Current Password</label>
                <input type="text" placeholder='Enter current password'
                className='border-2 border-border rounded-sm px-3 py-2 capitalize' />
            </div>

            <div className='flex flex-col gap-3'>
                <label className='font-semibold text-lg'>New Password</label>
                <input type="text" placeholder='Enter new password'
                className='border-2 border-border rounded-sm px-3 py-2 capitalize' />
            </div>
            <div className='flex flex-col gap-3'>
                <label className='font-semibold text-lg'>Confirm New Password</label>
                <input type="text" placeholder='re-enter new password'
                className='border-2 border-border rounded-sm px-3 py-2 capitalize' />
            </div>
        </form>
      </div>
    </div>
  )
}

export default Account
