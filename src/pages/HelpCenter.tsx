
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, MessageCircle, Phone, Mail } from 'lucide-react';

const HelpCenter = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I list an item for sale?",
      answer: "Click on 'List Item' in the header, fill in the product details, upload 5-30 photos, and submit your listing."
    },
    {
      question: "Is it safe to meet buyers/sellers?",
      answer: "Always meet in public places during daylight hours. Bring a friend if possible and trust your instincts."
    },
    {
      question: "How do I contact a seller?",
      answer: "Use the chat feature on each product page or call the phone number provided by the seller."
    },
    {
      question: "What payment methods are accepted?",
      answer: "Payment is arranged between buyer and seller. We recommend cash transactions for local meetups."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-xl font-semibold">Help Center</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <p className="text-muted-foreground">Find answers to common questions about MoCha Market</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Get instant help from our support team</p>
              <Button size="sm">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-4">+266 2234 5678</p>
              <Button size="sm" variant="outline">Call Now</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">support@mochamarket.ls</p>
              <Button size="sm" variant="outline">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
