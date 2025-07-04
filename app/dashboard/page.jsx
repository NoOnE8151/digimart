import { ChartAreaInteractive } from "@/components/dashboard/overview/earnings chart";

export default function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-[5rem] mx-5">
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300">
        <img src="/assets/dashboard/profit.png" alt="profit icon" className="w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Total Earnings</h2>
          <div className="text-3xl font-bold">₹0.00</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300">
        <img src="/assets/dashboard/box.png" alt="box icon" className="w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Total Products</h2>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300">
        <img src="/assets/dashboard/customers.png" alt="customers icon" className="w-[4rem]" />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Total Customers</h2>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>
      <div className="md:w-[81vw] w-[90vw]">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}
