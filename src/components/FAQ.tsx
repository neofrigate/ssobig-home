"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/20 last:border-b-0">
      <button
        className="w-full py-4 text-left flex justify-between items-center transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base md:text-lg font-medium text-white pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4">
          <p
            className="text-sm md:text-base text-[#F4F4F4] font-normal leading-relaxed"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  );
};

interface FAQSectionProps {
  title?: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQSection = ({
  title = "자주 묻는 질문",
  questions,
}: FAQSectionProps) => {
  return (
    <div className="mb-16">
      <div className="bg-white/10 backdrop-blur-[30px] p-4 md:p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>

        <div className="space-y-0">
          {questions.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};
