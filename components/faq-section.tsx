"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

// SEO-optimized FAQ data with simple, non-technical language
const faqItems = [
  {
    id: "privacy-guarantee",
    question: "Is my data really private?",
    answer:
      "Yes, completely. Your Private PDF works entirely on your device. Files are processed right in your browser without being sent anywhere. We never see, store, or have access to any of your documents.",
  },
  {
    id: "how-works",
    question: "How does this work if there's no upload?",
    answer:
      "Your Private PDF uses your computer's power to do all the work. When you upload a file, it stays in your browser and gets processed there. Think of it like having a PDF tool built directly into your browser.",
  },
  {
    id: "browser-support",
    question: "Will this work on my computer or phone?",
    answer:
      "Yes! Your Private PDF works on all modern browsers like Chrome, Firefox, Safari, and Edge on computers, tablets, and phones. If you're using an older device or browser, you might experience issues.",
  },
  {
    id: "file-size-limits",
    question: "Is there a file size limit?",
    answer:
      "Most modern devices can handle files up to 500MB. If you're using a phone or an older computer, keep files smaller (under 100MB) for better performance. Very large files may slow things down.",
  },
  {
    id: "compression-quality",
    question: "Will compressing my PDF make it look bad?",
    answer:
      "That depends on what you choose. We offer three options: Light compression makes files 20-30% smaller with hardly any change, Medium makes them 40-50% smaller with some minor changes, and Strong makes them 60%+ smaller but the quality drops more noticeably.",
  },
  {
    id: "ocr-accuracy",
    question: "How well does the text recognition work?",
    answer:
      "It works well for clear, printed text in English and other languages—usually around 90% accuracy. Handwritten notes or blurry images won't work as well. Always check the results before using the extracted text.",
  },
  {
    id: "merge-multiple",
    question: "Can I reorder PDFs before merging them?",
    answer:
      "Upload multiple PDFs and drag them around to put them in any order you want. You can even see previews before you merge them together.",
  },
  {
    id: "offline-usage",
    question: "Can I use this offline?",
    answer:
      "Once you load the app, yes! Everything works offline after that. You don't need internet to convert, merge, or compress your PDFs. This is perfect for secure networks or when traveling.",
  },
  {
    id: "no-tracking",
    question: "Do you track what I convert?",
    answer:
      "Never. We don't know what you do with Your Private PDF. No tracking, no logs, no activity records. Everything stays between you and your device.",
  },
  {
    id: "open-source",
    question: "Is this app trustworthy?",
    answer:
      "Yes. Your Private PDF is built using well-known, trusted open-source tools. The code that runs in your browser is transparent and can be inspected. We believe privacy should be verifiable.",
  },
  {
    id: "limitations",
    question: "What PDFs might not work well?",
    answer:
      "PDFs with special features like forms, digital signatures, or complex designs might have issues. Some PDFs are already very compressed and won't shrink much. If a PDF has security protection, we might not be able to process it.",
  },
  {
    id: "password-protected",
    question: "Can I process password-protected PDFs?",
    answer:
      "Not directly. If your PDF is password-protected, you'll need to unlock it with another tool first. Once it's unlocked, Your Private PDF can process it locally.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Find answers about privacy, how Your Private PDF works, and what you can do with it.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-6 bg-card">
                <AccordionTrigger className="py-4 hover:text-primary transition-colors">
                  <span className="text-left text-base font-semibold">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Schema markup for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  )
}
