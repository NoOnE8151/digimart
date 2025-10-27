import { Menu } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="w-[100vw] min-h-[100vh] overflow-hidden bg-background flex flex-col items-center">
      <header className="flex items-center justify-between w-[90%] h-[13vh]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo/logo.png" alt="logo" className="w-[3rem]" />
          <h1 className="font-bold text-xl ">Digimart</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-5 font-semibold">
          <div>Features</div>
          <div>Sell</div>
          <div>Pricing</div>
        </nav>

        <div className="lg:flex hidden items-center gap-5 w-[15%]">
          <SignedOut>
            <SignInButton>
              <button className="bg-[#ECECEC] hover:bg-[#e1e1e1] active:bg-[#eeeeee] px-5 py-2 w-1/2 rounded-full font-semibold shadow cursor-pointer">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-[#3B82F6] hover:bg-[#3675db] active:bg-[#297bff] text-white px-5 py-2 w-1/2 rounded-full font-semibold shadow cursor-pointer ">
                Sign&nbsp;Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>

        <button className="lg:hidden">
          <Menu />
        </button>
      </header>

      <main className="flex flex-col items-center justify-start relative w-full py-10 gap-10 lg:py-0 lg:justify-center">
        <section className="bg-[#CFE8FF] flex flex-col justify-center items-center w-[90%] rounded-2xl my-5 gap-10 max-h-[60em] pt-32 overflow-hidden">
          <div className="flex flex-col lg:gap-7 gap-5 items-center justify-center lg:w-[70%] w-full px-4 text-center pt-32 pb-10">
            <h1 className="lg:text-6xl text-3xl md:text-5xl font-bold leading-tight">
              Turn your creativity into income in minutes.
            </h1>
            <p className="lg:text-3xl text-lg md:text-2xl text-[#575757] font-semibold">
              Sell with UPI, get paid instantly
            </p>
            <SignUpButton>
              <button className="bg-[#3B82F6] hover:bg-[#3675db] active:bg-[#297bff] transition-colors cursor-pointer text-white px-5 py-3 rounded-full lg:text-2xl text-xl lg:w-1/2 md:w-1/2 w-full font-semibold my-3">
                Start selling for free
              </button>
            </SignUpButton>
          </div>

          <img
            src="/assets/landing page/featured image.png"
            alt="Platform dashboard preview showing UPI payment integration"
            className="w-full rounded-lg"
          />
        </section>

        <section className="w-[90%] flex flex-col items-center gap-10">
          <div className="flex flex-col justify-center items-center gap-3 py-10">
            <h2 className="font-bold text-5xl">All the features you need</h2>
            <p className="text-lg text-muted-foreground">
              Build a store and start selling your products in minutes.
            </p>
          </div>

          <div className="bg-[#CFE8FF] rounded-xl flex justify-center h-[50rem] w-full p-5">
            <div className="w-1/2 flex flex-col justify-between px-10">

            <div className="flex flex-col gap-5">
              <h2 className="text-5xl font-bold p-5">
                Sell Digital Products For Free In Digimart
              </h2>

              <p className="text-lg text-foreground px-5 font-semibold">
                Start earning instantly without paying monthly fees or setup
                costs. DigiMart lets creators sell eBooks, courses, templates,
                or any digital file directly with{" "}
                <span className="font-semibold text-black">UPI payments</span> —
                no middlemen, no waiting.
              </p>
            </div>

              <div className="pb-10">

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h3 className="text-xl font-semibold">Instant payouts to your UPI ID</h3>
                  <p>Receive your earnings directly to your UPI account within seconds of every sale — no waiting, no thresholds.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Zero monthly fees, only 10% per sale</h3>
                  <p>Start for free. Pay a small commission only when you earn — no subscriptions or hidden costs.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Secure file hosting and delivery</h3>
                  <p>Your digital products are safely stored and automatically delivered to buyers after payment.</p>
                </div>

              </div>

              <SignUpButton>
              <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer">
                Start Selling Now
              </button>
              </SignUpButton>

              </div>
            </div>

            <div className="w-1/2 bg-[#60a8eb] h-full rounded-xl overflow-hidden grid grid-cols-2 gap-5 px-10 py-5 justify-items-center">
            <img src="/assets/landing page/dummy products/product1.png" alt="dummy product" className="w-[95%] rounded-lg shadow-2xl rotate-3 translate-y-16" />
            <img src="/assets/landing page/dummy products/product2.png" alt="dummy product" className="w-[97%] rounded-lg shadow-2xl rotate-[-3deg] translate-y-5" />
            <img src="/assets/landing page/dummy products/product3.png" alt="dummy product" className="w-full rounded-lg shadow-2xl rotate-[-3deg] translate-x-[135px] translate-y-5" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
