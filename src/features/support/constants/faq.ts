export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I track my order?",
    answer:
      "Go to Profile → Orders History, tap on any order, and press the \"Live Tracking\" button to see real-time delivery updates on the map.",
  },
  {
    question: "Can I change my delivery address after placing an order?",
    answer:
      "Unfortunately, you cannot change the delivery address once the order is confirmed. Please cancel the order and place a new one with the correct address.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, Discover, JCB) as well as Apple Pay. You can manage your saved cards in Profile → Payment Methods.",
  },
  {
    question: "How do I cancel an order?",
    answer:
      "You can cancel an order within 5 minutes of placing it. Go to Orders History, open the order details, and tap 'Cancel Order'. After 5 minutes, please contact our support team.",
  },
  {
    question: "How do I update my profile information?",
    answer:
      "Go to Profile → Edit Profile. You can update your first name, last name, phone number, and date of birth. Changes are saved automatically when you tap 'Save'.",
  },
  {
    question: "Is there a minimum order amount?",
    answer:
      "There is no minimum order amount. However, a delivery fee may apply for orders under $15. Free delivery is available for orders above $15.",
  },
  {
    question: "How do I report an issue with my order?",
    answer:
      "Go to Profile → Support and fill out the contact form with your order number and a description of the issue. Our team will respond within 24 hours.",
  },
];
