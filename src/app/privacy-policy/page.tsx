import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Privacy Policy | Christ Revelation Church",
  description: "Privacy Policy for Christ Revelation Church.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-[#FAFAFA] text-[#0c0c0c]">
      <section className="w-full pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24">
        <div className="max-w-[800px] mx-auto w-full flex flex-col">
          
          <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-12">
            Privacy Policy
          </h1>

          <div className="flex flex-col gap-8 font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 leading-relaxed font-light">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>
              At Christ Revelation Church, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">1. Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and mailing address when you voluntarily provide it to us through forms on our website (e.g., contact forms, prayer requests, newsletter signups, or donation pages).
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">2. How We Use Your Information</h2>
            <p>
              The information we collect is used to respond to your inquiries, process donations, send updates about church events, and provide you with relevant content. We do not sell or rent your personal information to third parties.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">3. Data Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">4. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us at info@christrevelation.org.
            </p>
          </div>

        </div>
      </section>
      <CtaSection />
    </main>
  );
}
