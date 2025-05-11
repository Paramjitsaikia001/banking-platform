import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  const faqs = [
    {
      question: "How secure is the banking application?",
      answer:
        "Our banking application uses industry-standard security measures including end-to-end encryption, two-factor authentication, and biometric verification. All data is encrypted both in transit and at rest, and we regularly conduct security audits to ensure your information remains protected.",
    },
    {
      question: "Are there any fees for using the platform?",
      answer:
        "The basic features of our platform are free to use, including account management, wallet transfers, and bill payments. Some premium features or expedited transfers may incur small fees, which are always clearly displayed before you confirm any transaction.",
    },
    {
      question: "How do I link my bank account?",
      answer:
        "To link your bank account, navigate to the 'Accounts' section in your profile, select 'Link New Account', and follow the secure verification process. We use bank-level security protocols to ensure your banking credentials are never stored on our servers.",
    },
    {
      question: "What should I do if I lose my phone?",
      answer:
        "If you lose your phone, you should immediately log in to your account from another device and change your password. You can also freeze your account temporarily through our website. Contact our customer support team who can help secure your account and assist with additional security measures.",
    },
    {
      question: "Can I use the app internationally?",
      answer:
        "Yes, our app is designed for global use. You can access your account from anywhere in the world with an internet connection. For international transfers, we offer competitive exchange rates and lower fees than traditional banks.",
    },
    {
      question: "How long do transfers take to process?",
      answer:
        "Internal transfers between users on our platform are instant. Transfers to linked bank accounts typically take 1-3 business days, depending on your bank's processing times. We also offer expedited transfer options for urgent transactions.",
    },
  ]

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our banking platform.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
