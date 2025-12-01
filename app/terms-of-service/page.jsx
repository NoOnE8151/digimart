import React from "react";
import Header from "@/components/header";

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
    <div className="text-gray-600 space-y-2 text-sm md:text-base">{children}</div>
  </section>
);

const TOS = () => {
  return (
    <>
    <header className="md:fixed md:p-5">
      <div className='flex items-center'>
        <img src="/assets/logo/logo.png" alt="logo" className='w-[4rem]' />
        <h1 className='text-2xl font-semibold md:block '>Digimart</h1>
        </div>
    </header>
    <main className="max-w-4xl mx-auto p-4 md:p-8 md:py-[3rem]">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Terms of Service
      </h1>
      <Section title="1. Introduction">
        <p>
          Welcome to <strong>Digimart</strong>. These Terms of Service
          govern your use of our platform for selling and buying digital
          products.
        </p>
      </Section>

      <Section title="2. Account Registration">
        <p>
          You must be 18 or older to register. You are responsible for all
          activities under your account.
        </p>
      </Section>

      <Section title="3. Seller Responsibilities">
        <ul className="list-disc list-inside">
          <li>Only upload content you own or have rights to sell.</li>
          <li>Illegal, harmful, or copyrighted material is not allowed.</li>
          <li>KYC must be completed accurately and honestly.</li>
        </ul>
      </Section>

      <Section title="4. Payments and Withdrawals">
        <p>
          We use Razorpay to process payments. Withdrawals are only possible
          after successful KYC. Taxes are your responsibility.
        </p>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          You retain ownership of uploaded content, but grant us a license to
          distribute and display your products.
        </p>
      </Section>

      <Section title="6. Prohibited Activities">
        <ul className="list-disc list-inside">
          <li>No illegal content or activities</li>
          <li>No malware or harmful software</li>
          <li>No reverse-engineering or disruption of the service</li>
        </ul>
      </Section>

      <Section title="7. Termination">
        <p>
          We reserve the right to suspend or delete accounts violating our terms
          or involved in fraud.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          We are not liable for any data loss, payment delays, or disputes. Use
          at your own risk.
        </p>
      </Section>

      <Section title="9. Modifications">
        <p>
          We may update these terms anytime. Continued use means acceptance of
          changes.
        </p>
      </Section>

    </main>
</>
  );
};

export default TOS;
