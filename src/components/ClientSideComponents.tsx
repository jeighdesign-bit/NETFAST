"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });

export default function ClientSideComponents() {
  return (
    <>
      <FAQSection />
      <Chatbot />
    </>
  );
}
