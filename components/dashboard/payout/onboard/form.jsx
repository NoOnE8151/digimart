"use client"
import React, { useEffect, useState } from 'react'
import { X } from "lucide-react"
import { useUser } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';

const OnboardingForm = ({ setIsOnboardFormOpen }) => {
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState();
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: { email }
  });

  useEffect(() => {
    if (isLoaded && user) {
      setEmail(user.primaryEmailAddress.emailAddress);
      setValue('email', user.primaryEmailAddress.emailAddress);
    }
  }, [user, isLoaded, setValue]);

  const postalCode = watch('postal_code');

  useEffect(() => {
    if (postalCode && postalCode.length === 6) {
      fetchCityState(postalCode);
    }
  }, [postalCode]);

  const fetchCityState = async (pin) => {
    setLoadingPin(true);
    setPinError("");
    try {
const res = await fetch(`https://api.zippopotam.us/in/${pin}`);
    const data = await res.json();
    
    if (data.country && data.places && data.places.length > 0) {
      const place = data.places[0];
      setValue('city', place['place name']);
      setValue('state', place.state);
    } else {
      throw new Error('Invalid PIN code');
    }
  } catch (err) {
    setPinError("Invalid PIN code or unable to fetch location");
    setValue('city', "");
    setValue('state', "");
  }
  
  setLoadingPin(false);
  };

  // state to handle api response error
  const [onboardError, setOnboardError] = useState('something went wrong');
  const [showOnboardError, setShowOnboardError] = useState(false);
  const [showOnboardSuccess, setShowOnboardSuccess] = useState(false);

  const [isOnboarding, setIsOnboarding] = useState(false);

  const onboard = async (data) => {
    setIsOnboarding(true);
    const res = await fetch('/api/razorpay/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data })
    });
    const r = await res.json();
    console.log(r);

    if (!r.success) {
      setOnboardError(r.message);
      setShowOnboardError(true);
    } else {
      setIsOnboardFormOpen(false);
    }
    setIsOnboarding(false);

  };

  return (
    <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
 <form
  onSubmit={handleSubmit(onboard)}
  className="bg-background md:w-[35%] w-[90%] min-h-[50%] gap-7 max-h-[90%] relative rounded-lg px-10 pt-10 pb-5 flex flex-col justify-between overflow-y-scroll"
>
  <button
    onClick={() => setIsOnboardFormOpen(false)}
    type="button"
    className="absolute cursor-pointer top-0 right-0 p-3"
  >
    <X />
  </button>

  <div className="flex flex-col gap-5">
    <h1 className="text-2xl font-bold">Personal Information</h1>

    {/* Business Name */}
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">
        Legal Business Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter your full name"
        className={`border-2 px-3 py-1 rounded-sm ${errors.businessName ? 'border-red-500' : ''}`}
        {...register('businessName', {
          required: { value: true, message: 'please enter your full name' },
          minLength: { value: 4, message: 'minimum lenght is 4 characters for name' },
          maxLength: { value: 200, message: 'maximum length is 200 characters' }
        })}
      />
      {errors.businessName && <p className="text-red-500">{errors.businessName.message}</p>}
    </div>

    {/* Contact Name */}
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">
        Contact Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="Enter your contact name"
        className={`border-2 px-3 py-1 rounded-sm ${errors.contactName ? 'border-red-500' : ''}`}
        {...register('contactName', {
          required: { value: true, message: 'please enter your contact name' },
          minLength: { value: 4, message: 'minimum length is 4 characters for name' },
          maxLength: { value: 200, message: 'maximum length is 200 characters' }
        })}
      />
      {errors.contactName && <p className="text-red-500">{errors.contactName.message}</p>}
    </div>

    {/* Email */}
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">Email</label>
      <input
        disabled
        type="email"
        className="border-2 px-3 py-1 rounded-sm cursor-not-allowed"
        {...register('email')}
      />
    </div>

    {/* Phone */}
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-lg">
        Phone no <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        placeholder="Enter your phone no"
        className={`border-2 px-3 py-1 rounded-sm ${errors.phone ? 'border-red-500' : ''}`}
        {...register('phone', {
          required: { value: true, message: 'please enter your phone number' },
          minLength: { value: 10, message: 'phone number must be atleast 10 digits' },
          maxLength: { value: 10, message: 'maximum length of phone no is 10.' }
        })}
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
    </div>

    <h2 className="text-xl font-bold mt-4">Registered Address</h2>

    <div className="flex flex-col gap-2">
      <label>
        Street 1 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="e.g., 123 MG Road"
        className={`border-2 px-3 py-1 rounded-sm ${errors.street1 ? 'border-red-500' : ''}`}
        {...register('street1', { required: 'Street 1 is required' })}
      />
      {errors.street1 && <p className="text-red-500 text-sm">{errors.street1.message}</p>}
    </div>

    <div className="flex flex-col gap-2">
      <label>Street 2</label>
      <input
        type="text"
        placeholder="e.g., Near City Mall"
        className={`border-2 px-3 py-1 rounded-sm ${errors.street2 ? 'border-red-500' : ''}`}
        {...register('street2')}
      />
    </div>

    <div className="flex flex-col gap-2">
      <label>
        Pin Code <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        placeholder='eg. 496450'
        className={`border-2 px-3 py-1 rounded-sm ${errors.postal_code ? 'border-red-500' : ''}`}
        {...register('postal_code', {
          required: 'Pin Code is required',
          minLength: { value: 6, message: 'Pin Code must be 6 digits' },
          maxLength: { value: 6, message: 'Pin Code must be 6 digits' }
        })}
      />
      {loadingPin && <span className="text-sm text-gray-500">Checking...</span>}
      {pinError && <span className="text-sm text-red-500">{pinError}</span>}
      {errors.postal_code && <p className="text-red-500 text-sm">{errors.postal_code.message}</p>}
    </div>

    <div className="flex flex-col gap-2">
      <label>
        City <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder="e.g., Raipur"
        disabled
        className={`border-2 px-3 py-1 rounded-sm ${errors.city ? 'border-red-500' : ''}`}
        {...register('city', { required: 'City is required' })}
      />
    </div>

<div className="flex flex-col gap-2">
  <label>
    State <span className="text-red-500">*</span>
  </label>
  <select
    className={`border-2 px-3 py-1 rounded-sm ${errors.state ? 'border-red-500' : ''}`}
    {...register('state', { required: 'State is required' })}
    defaultValue=""
  >
    <option value="" disabled>Select State</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Delhi">Delhi</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>
  </select>
</div>
  </div>

  <input
    type="submit"
    disabled={isOnboarding}
    value={isOnboarding ? 'Working on it' : 'Link Account'}
    className={`${isOnboarding ? 'bg-element-active' : 'bg-element'} hover:bg-element-hover active:bg-element-active text-white font-semibold px-5 py-2 rounded-lg cursor-pointer`}
  />
</form>

{showOnboardError && <div className='bg-black/50 w-full h-full fixed flex justify-center items-center'>
<div className='bg-background md:w-[20%] rounded-lg px-5 py-3 flex flex-col gap-5'>
  <h2 className='text-xl font-bold'>Error</h2>
  <p>{onboardError}</p>
  <button type='button' onClick={() => setShowOnboardError(false)} className='bg-element text-white font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active'>Retry</button>
</div>
</div>}

{showOnboardSuccess && <div className='bg-black/50 w-full h-full fixed flex justify-center items-center'>
<div className='bg-background md:w-[20%] rounded-lg px-5 py-3 flex flex-col gap-5'>
  <h2 className='text-xl font-bold '>Account Created</h2>
  <p>Successfully created <b>DigiMart Account</b> you can now recive money here, to withdraw earned money to your bank account please complete KYC (you can complete KYC later and start earning right now).</p>
  <button type='button' className='bg-element text-white font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active'>Complete KYC</button>
  <button type='button' onClick={() => setShowOnboardSuccess(false)} className='bg-gray-200 text-foreground font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-300 active:bg-gray-200'>Do Later</button>
</div>
</div>}

    </div>
  );
};

export default OnboardingForm;
