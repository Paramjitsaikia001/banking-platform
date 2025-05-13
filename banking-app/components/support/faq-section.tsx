"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search } from "lucide-react"

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const faqCategories = [
    {
      id: "account",
      name: "Account",
      faqs: [
        {
          question: "How do I reset my password?",
          answer:
            "To reset your password, go to the login screen and click on 'Forgot Password'. Enter your email address, and we'll send you a link to reset your password. Follow the instructions in the email to create a new password.",
        },
        {
          question: "How do I update my personal information?",
          answer:
            "You can update your personal information by going to Profile > Edit Profile. From there, you can update your name, email, phone number, and address. Make sure to save your changes when you're done.",
        },
        {
          question: "How do I enable two-factor authentication?",
          answer:
            "To enable two-factor authentication, go to Settings > Security. Toggle on the Two-Factor Authentication option and follow the prompts to set it up with your phone number or authenticator app.",
        },
      ],
    },
    {
      id: "payments",
      name: "Payments",
      faqs: [
        {
          question: "How do I send money to someone?",
          answer:
            "To send money, go to the Payments section and select 'Send Money'. Enter the recipient's email or phone number, the amount you want to send, and an optional note. Review the details and confirm the transaction.",
        },
        {
          question: "What are the transaction limits?",
          answer:
            "Transaction limits vary based on your account type and verification status. Basic accounts can send up to $1,000 per day, while verified accounts can send up to $5,000 per day. You can view your specific limits in Settings > Limits.",
        },
        {
          question: "How long do transfers take?",
          answer:
            "Transfers between users on our platform are instant. Transfers to linked bank accounts typically take 1-3 business days, depending on your bank's processing times. We also offer expedited transfer options for urgent transactions.",
        },
      ],
    },
    {
      id: "wallet",
      name: "Wallet",
      faqs: [
        {
          question: "How do I add money to my wallet?",
          answer:
            "To add money to your wallet, go to the Wallet section and click 'Add Money'. You can add funds using a linked bank account, debit card, or credit card. Follow the prompts to complete the transaction.",
        },
        {
          question: "Is there a fee for adding money to my wallet?",
          answer:
            "Adding money from a linked bank account is free. Adding money using a debit card incurs a 1% fee, while credit card transfers incur a 3% fee. All fees are displayed before you confirm the transaction.",
        },
        {
          question: "How do I transfer money from my wallet to my bank account?",
          answer:
            "To transfer money from your wallet to your bank account, go to the Wallet section and select 'Transfer to Bank'. Choose the bank account you want to transfer to, enter the amount, and confirm the transaction. Standard transfers take 1-3 business days to complete.",
        },
      ],
    },
    {
      id: "security",
      name: "Security",
      faqs: [
        {
          question: "What should I do if I notice unauthorized transactions?",
          answer:
            "If you notice unauthorized transactions, immediately go to Settings > Security and select 'Freeze Account'. Then contact our support team through the Help & Support section. We'll help you secure your account and investigate the transactions.",
        },
        {
          question: "How does the app protect my financial information?",
          answer:
            "We use industry-standard encryption to protect all data transmitted through our app. Your financial information is stored in secure, encrypted databases. We also offer features like biometric authentication and two-factor authentication to further secure your account.",
        },
        {
          question: "Can I use the app on multiple devices?",
          answer:
            "Yes, you can use the app on multiple devices. For security reasons, you'll need to verify your identity when logging in on a new device. You can manage all your connected devices in Settings > Devices & Security.",
        },
      ],
    },
  ]

  // Filter FAQs based on search term
  const filteredFAQs = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  // Check if any FAQs match the search term
  const hasResults = filteredFAQs.some((category) => category.faqs.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Find answers to common questions about our banking app</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search FAQs..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {hasResults ? (
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              {faqCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} disabled={category.faqs.length === 0}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {faqCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs
                    .find((c) => c.id === category.id)
                    ?.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search term or browse the categories for more information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
