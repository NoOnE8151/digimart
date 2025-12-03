"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const STEPS = {
  INTRO: 0,
  PERSONAL: 1,
  ADDRESS: 2,
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function PreKycUI({ setIsPreKycUiShowing, subMerchant }) {
  const [currentStep, setCurrentStep] = useState(STEPS.INTRO);
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: subMerchant?.legalBusinessName || "",
      email: subMerchant?.email || "",
      phone: subMerchant?.phone?.slice?.(3) || "",
      pan: "",
      street1: "",
      street2: "",
      postal_code: "",
      city: "",
      state: "",
    },
  });

  const panValue = watch("pan");
  const postalCode = watch("postal_code");
  const street1 = watch("street1");
  const city = watch("city");
  const state = watch("state");

  // Check if Personal Info step is valid
  const isPersonalStepValid = panValue && /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panValue);

  // Check if Address step is valid
  const isAddressStepValid = street1 && postalCode && city && state && !pinError;

  // Fetch city and state from PIN code
  useEffect(() => {
    if (!postalCode || postalCode.length !== 6) {
      setPinError("");
      return;
    }

    const fetchCityState = async () => {
      setLoadingPin(true);
      setPinError("");

      try {
        const res = await fetch(`https://api.zippopotam.us/in/${postalCode}`);
        
        if (!res.ok) {
          throw new Error("Invalid PIN");
        }

        const data = await res.json();

        if (data?.places?.length > 0) {
          const place = data.places[0];
          const cityName = place["place name"];
          const stateName = place.state;
          
          setValue("city", cityName, { shouldValidate: true });
          
          // Match state name with our list (case-insensitive)
          const matchedState = INDIAN_STATES.find(
            s => s.toUpperCase() === stateName.toUpperCase()
          );
          
          if (matchedState) {
            setValue("state", matchedState, { shouldValidate: true });
          } else {
            setValue("state", stateName, { shouldValidate: true });
          }
          
          setPinError("");
        } else {
          throw new Error("Invalid PIN");
        }
      } catch (err) {
        setPinError("Invalid PIN code or unable to fetch location");
        setValue("city", "");
        setValue("state", "");
      } finally {
        setLoadingPin(false);
      }
    };

    fetchCityState();
  }, [postalCode, setValue]);

  const submitStakeholder = async (data) => {
    try {
      console.log("KYC submission:", data);
      // Add your API call here
      // await apiService.submitKYC(data);
      
      // On success, close the modal
      // setIsPreKycUiShowing(false);
      
      alert("KYC submitted successfully!");
    } catch (error) {
      console.error("KYC submission failed:", error);
      alert("Failed to submit KYC. Please try again.");
    }
  };

  const closeModal = () => setIsPreKycUiShowing(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(submitStakeholder)(e);
  };

  const stepLabel = () => {
    if (currentStep === STEPS.INTRO) return "Step 1 of 3";
    if (currentStep === STEPS.PERSONAL) return "Step 2 of 3";
    return "Step 3 of 3";
  };

  const stepProgress = () => {
    if (currentStep === STEPS.INTRO) return "w-1/3";
    if (currentStep === STEPS.PERSONAL) return "w-2/3";
    return "w-full";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {stepLabel()}
            </span>
            <h1 className="text-lg font-bold">Complete KYC</h1>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-100">
          <div
            className={`h-full bg-blue-600 transition-all duration-500 ${stepProgress()}`}
          ></div>
        </div>

        {/* Slides */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              width: '300%',
              transform: `translateX(-${(currentStep * 100) / 3}%)` 
            }}
          >
            {/* STEP 0 – INTRO */}
            <section className="w-1/3 px-6 py-6 space-y-4 flex-shrink-0">
              <p className="text-sm text-gray-700 leading-relaxed">
                Completing your KYC enables secure withdrawals and settlements
                directly into your verified bank account.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                By clicking <strong>Start KYC</strong> you accept{" "}
                <strong>Digimart's</strong>{" "}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  terms of service
                </a>
                .
              </p>

              <div className="mt-6 flex justify-between pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(STEPS.PERSONAL)}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Start KYC
                </button>
              </div>
            </section>

            {/* STEP 1 – PERSONAL */}
            <section className="w-1/3 px-6 py-6 space-y-4 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>

              <div className="space-y-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Name *</label>
                  <input
                    disabled
                    {...register("name")}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input
                    disabled
                    {...register("email")}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <div className="flex">
                    <span className="px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm flex items-center text-gray-600 font-medium">
                      +91
                    </span>
                    <input
                      disabled
                      {...register("phone")}
                      className="w-full rounded-r-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* PAN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">PAN *</label>
                  <input
                    maxLength={10}
                    placeholder="AAAAA9999A"
                    {...register("pan", {
                      required: "PAN number is required",
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                        message: "Invalid PAN format (e.g., ABCDE1234F)",
                      },
                      setValueAs: (v) => v.toUpperCase(),
                    })}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.pan ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.pan && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {errors.pan.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel KYC
                </button>

                <button
                  type="button"
                  disabled={!isPersonalStepValid}
                  onClick={() => setCurrentStep(STEPS.ADDRESS)}
                  className={`rounded-lg px-8 py-2.5 text-sm text-white font-semibold transition-colors ${
                    isPersonalStepValid
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </section>

            {/* STEP 2 – ADDRESS */}
            <section className="w-1/3 px-6 py-6 space-y-4 flex-shrink-0">
              <h2 className="text-base font-semibold text-gray-900">Registered Address</h2>

              <div className="space-y-4">
                {/* Street 1 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Street 1 *</label>
                  <input
                    placeholder="Building name, street name"
                    {...register("street1", { 
                      required: "Street address is required",
                      minLength: {
                        value: 3,
                        message: "Address must be at least 3 characters"
                      }
                    })}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.street1 ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.street1 && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {errors.street1.message}
                    </p>
                  )}
                </div>

                {/* Street 2 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Street 2 (Optional)</label>
                  <input
                    placeholder="Apartment, suite, floor (optional)"
                    {...register("street2")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Pin Code *</label>
                  <input
                    maxLength={6}
                    placeholder="496450"
                    {...register("postal_code", {
                      required: "Pin Code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Pin Code must be exactly 6 digits",
                      },
                    })}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.postal_code || pinError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                  {loadingPin && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <span className="inline-block animate-spin">⟳</span> Fetching location...
                    </span>
                  )}
                  {pinError && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {pinError}
                    </span>
                  )}
                  {errors.postal_code && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {errors.postal_code.message}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input
                    disabled
                    {...register("city", { required: "City is required" })}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 cursor-not-allowed"
                    placeholder="Auto-filled from PIN"
                  />
                </div>

                {/* State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <select
                    {...register("state", { required: "State is required" })}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(STEPS.PERSONAL)}
                  className="rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>

                <button
                  disabled={isSubmitting || !isAddressStepValid}
                  type="button"
                  onClick={handleFormSubmit}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                    isSubmitting || !isAddressStepValid
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin">⟳</span>
                      Completing...
                    </span>
                  ) : (
                    "Complete KYC"
                  )}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}