"use client"
import { ChartAreaInteractive } from "@/components/dashboard/overview/earnings chart";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const pathname = usePathname();
      useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 mx-5 py-20">
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img src="/assets/dashboard/profit.png" alt="profit icon" className=" w-[3rem] md:w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Earnings</h2>
          <div className="md:text-3xl text-2xl font-bold">₹0.00</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img src="/assets/dashboard/box.png" alt="box icon" className=" w-[3rem] md:w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Products</h2>
          <div className="md:text-3xl text-2xl font-bold">0</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img src="/assets/dashboard/customers.png" alt="customers icon" className=" w-[3rem] md:w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Customers</h2>
          <div className="md:text-3xl text-2xl font-bold">0</div>
        </div>
      </div>
      <div className="md:w-[81vw] w-[90vw]">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
