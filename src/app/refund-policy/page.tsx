import CtaSection from "@/components/home/CtaSection";

export const metadata = {
  title: "Return & Refund Policy | Christ Revelation Church",
  description: "Return and Refund Policy for Christ Revelation Church.",
};

export default function RefundPolicyPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-[#FAFAFA] text-[#0c0c0c]">
      <section className="w-full pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24">
        <div className="max-w-[800px] mx-auto w-full flex flex-col">
          
          <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-12">
            Return & Refund Policy
          </h1>

          <div className="flex flex-col gap-8 font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 leading-relaxed font-light">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
            
            <p>
              Thank you for your generous support of Christ Revelation Church. Your contributions help us fulfill our mission and serve our community. Please read our Return and Refund Policy regarding donations carefully.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">1. Donations</h2>
            <p>
              As a non-profit religious organization, all donations, tithes, and offerings made to Christ Revelation Church are generally considered non-refundable. We deeply appreciate your financial support.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">2. Errors in Processing</h2>
            <p>
              If a donation is made in error, such as an incorrect amount being processed due to a technical glitch or user error, please contact us within 7 days of the transaction. We will review the situation and, if applicable, process a refund for the erroneous amount.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">3. Event Registrations</h2>
            <p>
              For ticketed events or paid registrations, refunds may be issued if a cancellation request is received at least 48 hours before the event date. After this period, registrations are generally non-refundable unless otherwise stated for the specific event.
            </p>

            <h2 className="text-2xl font-medium text-[#0c0c0c] mt-4 mb-2">4. Contact Us</h2>
            <p>
              If you have any questions about this policy or need to request a refund due to an error, please reach out to our finance team at finance@christrevelation.org.
            </p>
          </div>

        </div>
      </section>
      <CtaSection />
    </main>
  );
}
