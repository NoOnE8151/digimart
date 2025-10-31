import { Menu } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-x-hidden">


      <header className="flex items-center justify-between w-[90%] h-[13vh]">
        <div className="flex items-center gap-3">
          <img src="/assets/logo/logo.png" alt="logo" className="w-[3rem]" />
          <h1 className="font-bold text-xl ">Digimart</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-5 font-semibold">
          <Link href="#features">Features</Link>
          <Link href="#sell">Sell</Link>
          <Link href="#pricing">Pricing</Link>
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
        <section id="hero" className="bg-[#CFE8FF] flex flex-col justify-center items-center w-[90%] rounded-2xl my-5 gap-10 max-h-[60em] pt-32 overflow-hidden">
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

        <section id="features" className="w-[90%] flex flex-col items-center gap-10">
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
                  <h3 className="text-xl font-semibold">Seamless Payment</h3>
                  <p>Receive your earnings to your bank account within a day no thresholds.</p>
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

        <section id="sell" className='w-[90%] mx-auto flex flex-col items-center gap-10 py-5'>
  <div className='text-center'>
    <h2 className='text-5xl font-bold mb-3'>How DigiMart Works</h2>
    <p className='text-lg text-muted-foreground'>
      From idea to income in just a few clicks.
    </p>
  </div>

  <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
    <div className='flex flex-col items-center text-center p-5 bg-[#CFE8FF] rounded-xl shadow'>
      <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>1</div>
      <h3 className='text-2xl font-semibold mb-2'>Create Your Product</h3>
      <p className='text-muted-foreground'>
        Upload your digital files, set a price, and customize your product page in minutes.
      </p>
    </div>

    <div className='flex flex-col items-center text-center p-5 bg-[#CFE8FF] rounded-xl shadow'>
      <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>2</div>
      <h3 className='text-2xl font-semibold mb-2'>Share Your Link</h3>
      <p className='text-muted-foreground'>
        Get a unique product link to share on social media, websites, or messages.
      </p>
    </div>

    <div className='flex flex-col items-center text-center p-5 bg-[#CFE8FF] rounded-xl shadow'>
      <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4'>3</div>
      <h3 className='text-2xl font-semibold mb-2'>Get Paid</h3>
      <p className='text-muted-foreground'>
        Earn instantly to your wallet as soon as user buy your product — amount settles to your linked bank account automatically.
      </p>
    </div>
  </div>
</section>

<section id="pricing" className='w-[90%] mx-auto flex flex-col items-center gap-10 py-20'>
  <div className='text-center'>
    <h2 className='text-5xl font-bold mb-3'>Simple & Transparent Pricing</h2>
    <p className='text-lg text-muted-foreground'>
      Start selling for free. Pay only a small commission when you earn — nothing else.
    </p>
  </div>

  <div className='bg-[#CFE8FF] rounded-2xl p-10 w-full md:w-[70%] flex flex-col md:flex-row justify-between items-center shadow-lg'>
    <div className='flex flex-col gap-4 md:w-1/2'>
      <h3 className='text-3xl font-bold'>Free Plan</h3>
      <p className='text-muted-foreground text-lg'>
        Perfect for individual creators and startups. No subscriptions or setup costs — just pure pay-per-sale.
      </p>

      <ul className='space-y-2 text-muted-foreground text-lg mt-3'>
        <li>✅ 0 ₹ setup or monthly fees</li>
        <li>💸 10% platform commission per sale</li>
        <li>⚡ Instant payment to wallet, auto-settled to bank</li>
        <li>🔒 Secure file hosting & delivery</li>
        <li>📊 Access to seller dashboard & analytics</li>
      </ul>
    </div>

    <div className='md:w-1/2 flex flex-col items-center justify-center mt-10 md:mt-0'>
      <div className='bg-white rounded-2xl p-10 w-full text-center shadow'>
        <h4 className='text-4xl font-bold mb-3'>10% <span className='text-lg font-normal text-muted-foreground'>per sale</span></h4>
        <p className='text-muted-foreground mb-6'>No earnings? No fees. You only pay when you sell.</p>
        <SignUpButton>
        <button className='bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition'>
          Start Selling for Free
        </button>
        </SignUpButton>
      </div>
    </div>
  </div>

  <p className='text-sm text-muted-foreground text-center w-[80%] md:w-[60%]'>
    *A 10% platform fee is automatically deducted from each successful transaction. 
    Payments are processed securely through Razorpay and settled to your linked bank account as per gateway timelines.
  </p>
</section>

<section className="w-[90%] mx-auto text-center py-20 flex flex-col items-center justify-center gap-6 bg-[#EAF4FF] rounded-2xl">
  <h2 className="text-5xl font-bold">Start Selling Your Digital Products Today</h2>
  <p className="text-lg text-muted-foreground max-w-2xl">
    Join a growing creator community. Upload your digital products, share your link, and earn effortlessly — 
    all with zero setup cost.
  </p>
  <SignUpButton>
  <button className="mt-6 px-8 py-4 bg-[#007BFF] hover:bg-[#0066d3] cursor-pointer transition-all text-white font-semibold rounded-xl text-lg">
    Get Started for Free
  </button>
  </SignUpButton>
  <p className="text-sm text-muted-foreground mt-3">No hidden charges • Instant wallet payments • Secure transactions</p>
</section>
      </main>
      <footer className="w-full bg-[#0A0F1C] text-white py-12 mt-20">
  <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
    
    {/* Brand Info */}
    <div className="flex flex-col gap-3 md:col-span-2">
      <h2 className="text-2xl font-bold">Digimart</h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        A simple way to sell your digital creations online. 
        Build, share, and earn — all in one platform.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
      <ul className="flex flex-col gap-2 text-gray-400 text-sm">
        <li><a href="#hero">Home</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#features">Features</a></li>
        <SignInButton>
          <li><button>Login</button></li>
        </SignInButton>
        <SignUpButton>
          <li><button>Register</button></li>
        </SignUpButton>
      </ul>
    </div>

    {/* Legal */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Legal</h3>
      <ul className="flex flex-col gap-2 text-gray-400 text-sm">
        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
        <li><Link href="/terms-of-service">Terms of Service</Link></li>
      </ul>
    </div>

    {/* Contact Us */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
      <ul className="flex flex-col gap-2 text-gray-400 text-sm">
        <li>Email: <a href="mailto:digimartcontactus@gmail.com" className="hover:text-blue-400">digimartcontactus@gmail.com</a></li>
        <li><Link href="/contact" className="hover:text-blue-400 underline">Go to Contact Page</Link></li>
      </ul>
    </div>
  </div>

  <div className="border-t border-gray-700 mt-10 pt-5 text-center text-gray-500 text-sm">
    © {new Date().getFullYear()} Digimart. All rights reserved by 
    <a 
      className="font-semibold underline hover:text-blue-900 ml-1" 
      href="https://www.instagram.com/codeconquests_?igsh=MTE1cTZtZzVtMWg1ZA==" 
      target="_blank"
    >
      @codeConquests_
    </a>
  </div>
</footer>


    </div>
  );
}
