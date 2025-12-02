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

  const [onboardError, setOnboardError] = useState('something went wrong');
  const [showOnboardError, setShowOnboardError] = useState(false);
  const [showOnboardSuccess, setShowOnboardSuccess] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState("");

  const [isOnboarding, setIsOnboarding] = useState(false);

  const onboard = async (data) => {
    setIsOnboarding(true);
    setShowOnboardError(false);
    
    try {
      const res = await fetch('/api/razorpay/onboard/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: data.businessName,
          contactName: data.contactName,
          email: data.email,
          phone: `+91${data.phone}`,
          street1: data.street1,
          street2: data.street2 || "",
          city: data.city,
          state: data.state,
          postalCode: data.postal_code,
        })
      });

      let r;
      try {
        r = await res.json();
      } catch {
        throw new Error("Response is not valid JSON");
      }

      console.log("API Response:", r);

      if (!r.success) {
        setOnboardError(r.message || "Failed to create account");
        setShowOnboardError(true);
        return;
      }

      if (r.onboardingUrl) {
        window.location.href = r.onboardingUrl;
        return;
      }

      setOnboardError("Account created but onboarding link unavailable. Please contact support.");
      setShowOnboardError(true);

    } catch (error) {
      console.error("Onboarding error:", error);
      setOnboardError(error.message || "Network error. Please try again.");
      setShowOnboardError(true);
    } finally {
      setIsOnboarding(false);
    }
  };


  const handleCompleteKYC = () => {
    if (onboardingUrl) {
      // Redirect to Razorpay's hosted onboarding page
      window.location.href = onboardingUrl;
    }
  };

  const handleDoLater = () => {
    setShowOnboardSuccess(false);
    setIsOnboardFormOpen(false);
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
                minLength: { value: 4, message: 'minimum length is 4 characters for name' },
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
            <div className="flex items-center gap-2">
              <span className="border-2 px-3 py-1 rounded-sm bg-gray-100">+91</span>
              <input
                type="text"
                placeholder="9876543210"
                className={`border-2 px-3 py-1 rounded-sm flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                {...register('phone', {
                  required: { value: true, message: 'please enter your phone number' },
                  pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be exactly 10 digits' }
                })}
              />
            </div>
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
              type="text"
              placeholder='eg. 496450'
              maxLength={6}
              className={`border-2 px-3 py-1 rounded-sm ${errors.postal_code ? 'border-red-500' : ''}`}
              {...register('postal_code', {
                required: 'Pin Code is required',
                pattern: { value: /^[0-9]{6}$/, message: 'Pin Code must be exactly 6 digits' }
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
              className={`border-2 px-3 py-1 rounded-sm bg-gray-100 cursor-not-allowed ${errors.city ? 'border-red-500' : ''}`}
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
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
              <option value="ANDHRA PRADESH">Andhra Pradesh</option>
              <option value="ARUNACHAL PRADESH">Arunachal Pradesh</option>
              <option value="ASSAM">Assam</option>
              <option value="BIHAR">Bihar</option>
              <option value="CHHATTISGARH">Chhattisgarh</option>
              <option value="DELHI">Delhi</option>
              <option value="GOA">Goa</option>
              <option value="GUJARAT">Gujarat</option>
              <option value="HARYANA">Haryana</option>
              <option value="HIMACHAL PRADESH">Himachal Pradesh</option>
              <option value="JHARKHAND">Jharkhand</option>
              <option value="KARNATAKA">Karnataka</option>
              <option value="KERALA">Kerala</option>
              <option value="MADHYA PRADESH">Madhya Pradesh</option>
              <option value="MAHARASHTRA">Maharashtra</option>
              <option value="MANIPUR">Manipur</option>
              <option value="MEGHALAYA">Meghalaya</option>
              <option value="MIZORAM">Mizoram</option>
              <option value="NAGALAND">Nagaland</option>
              <option value="ODISHA">Odisha</option>
              <option value="PUNJAB">Punjab</option>
              <option value="RAJASTHAN">Rajasthan</option>
              <option value="SIKKIM">Sikkim</option>
              <option value="TAMIL NADU">Tamil Nadu</option>
              <option value="TELANGANA">Telangana</option>
              <option value="TRIPURA">Tripura</option>
              <option value="UTTAR PRADESH">Uttar Pradesh</option>
              <option value="UTTARAKHAND">Uttarakhand</option>
              <option value="WEST BENGAL">West Bengal</option>
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
        </div>

        <input
          type="submit"
          disabled={isOnboarding}
          value={isOnboarding ? 'Creating Account...' : 'Link Account'}
          className={`${isOnboarding ? 'bg-element-active cursor-not-allowed' : 'bg-element hover:bg-element-hover active:bg-element-active cursor-pointer'} text-white font-semibold px-5 py-2 rounded-lg`}
        />
      </form>

      {/* Error Modal */}
      {showOnboardError && (
        <div className='bg-black/50 w-full h-full fixed flex justify-center items-center z-[60]'>
          <div className='bg-background md:w-[20%] w-[80%] rounded-lg px-5 py-3 flex flex-col gap-5'>
            <h2 className='text-xl font-bold text-red-600'>Error</h2>
            <p>{onboardError}</p>
            <button 
              type='button' 
              onClick={() => setShowOnboardError(false)} 
              className='bg-element text-white font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active'
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showOnboardSuccess && (
        <div className='bg-black/50 w-full h-full fixed flex justify-center items-center z-[60]'>
          <div className='bg-background md:w-[25%] w-[85%] rounded-lg px-5 py-5 flex flex-col gap-5'>
            <h2 className='text-xl font-bold text-green-600'>✅ Account Created Successfully</h2>
            <p>
              Your <b>DigiMart Account</b> has been created! To start receiving payments, you need to complete your KYC verification with Razorpay.
            </p>
            <p className='text-sm text-gray-600'>
              You'll be redirected to Razorpay's secure page where you can submit your PAN card, bank details, and other documents.
            </p>
            <button 
              type='button' 
              onClick={handleCompleteKYC}
              className='bg-element text-white font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-element-hover active:bg-element-active'
            >
              Complete KYC Now
            </button>
            <button 
              type='button' 
              onClick={handleDoLater} 
              className='bg-gray-200 text-foreground font-semibold px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-300 active:bg-gray-200'
            >
              Do Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingForm;