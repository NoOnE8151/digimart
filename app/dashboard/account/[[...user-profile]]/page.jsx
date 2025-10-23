"use client";
import React from "react";
import { UserProfile } from "@clerk/clerk-react";

const Account = () => {
  return (
    <div className="bg-black/40 w-full h-full flex justify-center items-center py-20">
      <UserProfile />
    </div>
  );
};

export default Account;
