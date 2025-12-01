import React from 'react'

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
    <div className="text-gray-600 space-y-2 text-sm md:text-base">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <>
    <header className="md:fixed md:p-5">
      <div className='flex items-center'>
        <img src="/assets/logo/logo.png" alt="logo" className='w-[4rem]' />
        <h1 className='text-2xl font-semibold md:block '>Digimart</h1>
        </div>
    </header>
     <main className="max-w-4xl mx-auto p-4 md:p-8 md:py-[3rem]">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

      <Section title="1. Introduction">
        <p>
          At <strong>Digimart</strong>, your privacy is important to us. This policy explains how we collect, use, and protect your data.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <ul className="list-disc list-inside">
          <li>User info: name, email, password</li>
          <li>Seller info: bank details, PAN, KYC docs</li>
          <li>Buyer info: purchase and download history</li>
          <li>Device info: IP, browser, device type</li>
        </ul>
      </Section>

      <Section title="3. Use of Information">
        <ul className="list-disc list-inside">
          <li>To maintain your account</li>
          <li>To process payments via Razorpay</li>
          <li>To detect and prevent fraud</li>
          <li>To communicate account-related updates</li>
        </ul>
      </Section>

      <Section title="4. Sharing of Information">
        <p>
          We do not sell your data. Data may be shared with payment and hosting providers or legal authorities when required.
        </p>
      </Section>

      <Section title="5. Data Security">
        <p>
          Your data is protected with encryption and secure protocols. Still, no method is 100% secure.
        </p>
      </Section>

      <Section title="6. Your Rights">
        <ul className="list-disc list-inside">
          <li>Access your data</li>
          <li>Request correction</li>
          <li>Delete your account</li>
        </ul>
      </Section>

      <Section title="7. Cookies">
        <p>
          We use cookies for analytics and experience improvement. By using our site, you consent to cookies.
        </p>
      </Section>

      <Section title="8. Changes to Policy">
        <p>This policy may be updated. Changes will be posted on this page.</p>
      </Section>

    </main>
    </>
  )
}

export default PrivacyPolicy
