import ContactSection from "@/components/contacts/ContactSection";
import CtaSection from "@/components/home/CtaSection";
import FaqSection from "@/components/home/FaqSection";

export const metadata = {
  title: "Contact Us | Christ Revelation Church",
  description: "Get in touch with us for any enquiries, prayer requests, and questions.",
};

export default function ContactsPage() {
  return (
    <main className="w-full flex flex-col min-h-screen bg-white">
      <ContactSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
