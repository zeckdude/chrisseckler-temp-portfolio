import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { contact } from "@/lib/content";
import ContactLinks from "@/components/analytics/contact-links";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Chris Seckler.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-case-study px-6 py-20">
      <Reveal>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
          {contact.headline}
        </h1>
        <p className="mt-5 max-w-xl text-lg text-text-secondary">{contact.body}</p>
      </Reveal>
      <ContactLinks />
    </div>
  );
}
