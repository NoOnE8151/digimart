import { Menu } from 'lucide-react';
import { SignInButton, SignOutButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
   <div className="w-[100vw] h-[100vh] overflow-hidden bg-background">
    <header className="flex items-center justify-between px-5 py-3 shadow-2xl h-[10vh]">
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
        <button className="bg-[#ECECEC] hover:bg-[#e1e1e1] active:bg-[#eeeeee] px-5 py-2 w-1/2 rounded-full font-semibold shadow cursor-pointer">Login</button>
          </SignInButton>
          <SignUpButton>
        <button className="bg-[#3B82F6] hover:bg-[#3675db] active:bg-[#297bff] text-white px-5 py-2 w-1/2 rounded-full font-semibold shadow cursor-pointer ">Sign&nbsp;Up</button>
          </SignUpButton>
        </SignedOut>
      </div>

      <button className='lg:hidden'><Menu /></button>
    </header>

    <main className="flex flex-col items-center lg:justify-center justify-start relative top-[20vh] lg:top-0 lg:h-[90vh] h-[97vh] px-3">
      <div className="flex flex-col lg:gap-7 gap-5 items-center justify-center lg:w-[50vw] md:w-[70vw] text-center">
      <h1 className="lg:text-6xl text-3xl md:text-5xl font-bold">Turn your creativity into income in minutes.</h1>
      <p className="lg:text-3xl text-lg md:text-2xl text-[#575757] font-semibold">Sell with UPI, get paid instantly</p>
      <button className="bg-[#3B82F6] hover:bg-[#3675db] active:bg-[#297bff] cursor-pointer text-white px-5 py-3 rounded-full lg:text-2xl text-xl lg:w-1/2 md:w-1/2 font-semibold my-3">Start selling for free</button>
      </div>
    </main>
   </div>
  );
}
