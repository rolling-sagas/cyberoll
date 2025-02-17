"use client"
import {create} from 'zustand';
import { useState } from 'react';

const useAccordionStore = create((set) => ({
    openItems: {},
    toggleItem: (index) => set((state) => ({
      openItems: {
        ...state.openItems,
        [index]: !state.openItems[index],
      },
    })),
  }));

const faqData = [
  {
    question: "What is Credit?",
    answer: "Credit is an in-game resource in Rolling Sagas used for generating new text during gameplay. Each generation costs 1 credit."
  },
  {
    question: "When do I receive Credits?",
    answer: "Daily login rewards will be issued every day to your account. Please note that daily login rewards included in subscriptions do not carry over from day to day, so take use of your daily rewards! For monthly Standard subscribers, 700 credits are granted at once after successful payment of your chosen subscription. Please note that those unused credits will be reset to 0 after your subscription expires. For annually Standard users, credits reset to 700 credits every month starting from your subscription date. Please note that unused credits will not roll over to next month, so make sure you take full use of your credits each month. For Advaned users, unlimited credits will take into effort immediately after successful payment until your subscription expires. You can always check your remaining and credits renewal time in your Profile.",
  },
  {
    question: "What is the priority of daily rewards credits and monthly credits for a Standard plan?",
    answer: "Daily login rewards will be deducted before your monthly credits. You can always check your daily rewards credits and monthly credits in your Profile"
  },
  {
    question: "How can I get more Credits?",
    answer: "You can upgrade to Standard plan for 700 credits per month and double daily login credit rewards or upgrade to Advanced plan for unlimited credits. Benefits will take into effort immediately after successful payment. We'll have additional credit purchase soon."
  },
  {
    question: "Can I switch plans?",
    answer: "You can upgrade your plan at any time, effective immediately by paying the difference. The next billing date will be based on the expiration date of the new plan. For example, Tom bought an annual Standard plan on July 17th, 2024 for 96usd and received 700 credits. On July 30th, Tom decides to upgrade to an annual Advanced plan. Tom only needs to pay the difference of 56usd (annual Standard plan 96usd minus the used one month Standard plan 8usd, minus annual advanced plan 144usd minus one month Standard plan). Advanced services start immediately after successful payment, with the next billing date for annual Advanced plan on July 30, 2025. Downgrades are always effective at the end of the current billing cycle.",
  },
  {
    question: "How to cancel my subscription?",
    answer: "Automatic subscription renewal is enabled when you purchase a subscription plan. To cancel, go to your Profile page. Your cancellation will take effect at the end of the current subscription period."
  },
  {
    question: "How do I request a refund?",
    answer: "Refunds are available only for annual subscriptions. You can receive a refund for the remaining months of your subscription. Credits issued for the current month are non-refundable. Fees for used months are charged at full price. Send an email with your login email address to support@rollingsagas.com."
  }
];

export default function FAQAccordion() {
    const { openItems, toggleItem } = useAccordionStore();
    const [height, setHeight] = useState({});

  const setItemHeight = (index, element) => {
    if (element && !height[index]) {
      setHeight((prevState) => ({
        ...prevState,
        [index]: element.scrollHeight,
      }));
    }
  };

  return (
<div className="mt-[120px] w-full pb-16 max-w-[844px]">
      <div className="flex flex-col items-center justify-center gap-3">
        <h2 className="text-3xl font-bold leading-[38px]  transition-all duration-500">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="mt-[42px] flex w-full flex-col items-center gap-[18px]">
        {faqData.map((item, index) => (
          <div
            key={index}
            data-state={openItems[index] ? "open" : "closed"}
            data-orientation="vertical"
            className="rounded-[14px] bg-neutral-0 px-[18px] py-3 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)] transition-colors duration-500 dark:bg-neutral-800"
          >
            <h3 className="flex w-full">
              <button
                type="button"
                aria-expanded={openItems[index] ? "true" : "false"}
                onClick={() => toggleItem(index)}
                className="group flex flex-1 items-center justify-between font-normal text-neutral-900 transition-all dark:text-neutral-0 text-left"
              >
                {item.question}
                <svg
                  fill="none"
                  viewBox="0 0 18 18"
                  className={`h-4 w-4 shrink-0 text-neutral-900 transition-transform duration-200 ${
                    openItems[index] ? "rotate-180" : ""
                  } dark:text-neutral-0`}
                >
                  <path
                    fill="currentColor"
                    d="M5.077 8.064c-.659-.72-.145-1.877.834-1.877h6.178c.979 0 1.493 1.156.834 1.877l-3.089 3.381c-.447.49-1.221.49-1.668 0l-3.09-3.38Z"
                  ></path>
                </svg>
              </button>
            </h3>
            <div
              ref={(el) => setItemHeight(index, el)}
              style={{
                maxHeight: openItems[index] ? `${height[index]}px` : "0",
              }}
              className={`overflow-hidden text-sm text-neutral-600 transition-[max-height] duration-300 ease-in-out dark:text-neutral-400`}
            >
              <div className="mt-2.5">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
