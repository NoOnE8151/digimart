"use client";
import { ChartAreaInteractive } from "@/components/dashboard/overview/earnings chart";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user } = useUser();
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    console.log('user object is ', user?.username);
  },[user])
  //get product count of the user
  const [productCount, setProductCount] = useState(0);
  const fetchProductCount = async () => {
    const res = await fetch("/api/product/getList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username }),
    });

    const r = await res.json();
    console.log(r);
    setProductCount(r.productList.length);
  };

  //get total earnings of user
  const [earnings, setEarnings] = useState([]); //array of earnings objects with fields {date: ..., earnings: ...}
  const [totalEarnings, setTotalEarnings] = useState(0); //sum of earnings

  const fetchEarnings = async () => {
    const res = await fetch("/api/earnings/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username }),
    });
    const r = await res.json();
    setEarnings(r.earnings);
    console.log(r);
  };

  useEffect(() => {
    console.log('earnings are retrived', earnings);
  }, [earnings]);

  //set the total earnings onces array of all earnings are fetched
  useEffect(() => {
  if (earnings?.[0]?.earnings) {
    const total = earnings[0].earnings.reduce(
      (acc, item) => acc + item.earnings,
      0
    );
    setTotalEarnings(total);
  }
}, [earnings]);


  //fetch customer list of user
  const [customers, setCustomers] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
    const fetchCustomers = async () => {
    const res = await fetch("/api/customer/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: user.username }),
    });
    const r = await res.json();
    setCustomers(r.customers);
    console.log('fetched customers', r);
  };

  //setting up total customer count onces customer list is fetched
  useEffect(() => {
    if(customers) {
      if(customers.length > 0) {
        setCustomerCount(customers.customerName.length);
      }
    }
  }, [customers])

  //fetch neccessary data to show on dashboard
  useEffect(() => {
    if (user) {
      fetchProductCount();
      fetchEarnings();
      fetchCustomers();
    }
  }, [user]);

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3 mx-5 py-20">
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img
          src="/assets/dashboard/profit.png"
          alt="profit icon"
          className=" w-[3rem] md:w-[4rem]"
        />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Earnings</h2>
          <div className="md:text-3xl text-2xl font-bold">₹{totalEarnings}</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img
          src="/assets/dashboard/box.png"
          alt="box icon"
          className=" w-[3rem] md:w-[4rem]"
        />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Products</h2>
          <div className="md:text-3xl text-2xl font-bold">{productCount}</div>
        </div>
      </div>
      <div className="bg-muted/50 aspect-video rounded-xl flex flex-col gap-5 p-5 border-[1px] border-gray-300 w-[90%] md:w-auto">
        <img
          src="/assets/dashboard/customers.png"
          alt="customers icon"
          className=" w-[3rem] md:w-[4rem]"
        />
        <div className="flex flex-col gap-3">
          <h2 className="md:text-xl text-lg font-semibold">Total Customers</h2>
          <div className="md:text-3xl text-2xl font-bold">{customerCount}</div>
        </div>
      </div>
      <div className="md:w-[81vw] w-[90vw]">
        <ChartAreaInteractive backendData={earnings?.earnings} />
      </div>
    </div>
  );
}
