import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Terms & Conditions | Christ Revelation Church",
  description: "Terms and Conditions for Christ Revelation Church.",
};

export default function TermsConditionsPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-[#FAFAFA] text-[#0c0c0c]">
      <section className="w-full pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24">
        <div className="max-w-[800px] mx-auto w-full flex flex-col">
          
          <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-12">
            Terms & Conditions
          </h1>

          <div className="flex flex-col gap-8 font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 leading-relaxed font-light">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>
              Welcome to the Christ Revelation Church website. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions of use.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">2. Use of Website Content</h2>
            <p>
              Unless otherwise stated, Christ Revelation Church owns the intellectual property rights in the website and material on the website. You may view, download for caching purposes only, and print pages from the website for your own personal use, subject to the restrictions set out below.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">3. Acceptable Use</h2>
            <p>
              You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">4. Limitations of Liability</h2>
            <p>
              Christ Revelation Church will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special or consequential loss.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">5. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at info@christrevelation.org.
            </p>
          </div>

        </div>
      </section>
      <CtaSection />
    </main>
  );
}
