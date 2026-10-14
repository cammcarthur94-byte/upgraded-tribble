"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Recomnd capture non-deterministic AI responses accurately?",
      answer:
        "Large Language Models (LLMs) are probabilistic and produce variations in wording between runs. Recomnd solves this by executing multi-sample query batches with fixed temperature seeds and real-user browser agents across ChatGPT Search, Perplexity Sonar, Google Gemini, and Claude 3.5. We aggregate repeated trials into statistically confident Visibility and Win-Rate indices, filtering out one-off hallucinations and ensuring your Share of Voice reflects genuine model consensus.",
    },
    {
      question: "How do you track AI Shopping product tiles across ChatGPT and Perplexity?",
      answer:
        "When an AI engine recommends products, it renders interactive carousel widgets featuring merchant links, product images, star ratings, and prices. Recomnd's headless collectors parse these generative product tiles in real time, cataloging which SKUs appear in position #1 through #5, tracking price parity against competitors, and monitoring carousel shelf share across commercial apparel, electronics, and DTC categories.",
    },
    {
      question: "What is the difference between a Brand Mention and an Inline Grounding Citation?",
      answer:
        "A Brand Mention occurs when an LLM simply writes your brand name in its prose response. An Inline Grounding Citation is a formal, clickable footnote linking to an authoritative third-party URL (e.g., reddit.com, womenshealthmag.com, nytimes.com) that the engine used to fact-check its recommendation. Grounding citations carry far higher conversion weight because users click them to complete purchases, and engines treat cited domains as ground truth for future answers.",
    },
    {
      question: "How does \"Verified Live Lift\" measure the ROI of completed Growth Tasks?",
      answer:
        "Whenever your team completes an optimization playbook item—such as injecting Schema.org Product markup or addressing an unanswered Reddit thread—Recomnd establishes a 14-day telemetry baseline. Our engine monitors subsequent model crawls to measure whether the targeted citation gap closed and calculates your post-execution visibility delta (+16.5% average lift across our DTC dataset).",
    },
    {
      question: "Can I try the platform with real data before connecting my own domain?",
      answer:
        "Yes, absolutely. We provide a full production sandbox preloaded with Gymshark's live activewear dataset benchmarked against Nike, Lululemon, and Alo Yoga. You can explore over 100 audited prompts, domain authority graphs, and AI shopping shelves immediately with zero setup, no credit card required, and instant access.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[11px] font-semibold tracking-wider text-slate-500 bg-white border border-slate-200/90 px-3 py-1 rounded-full uppercase shadow-2xs">
            Frequently Asked Questions
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            Executive GEO & AEO Answers
          </h3>
          <p className="text-sm text-slate-600">
            Everything your SEO, growth, and ecommerce leadership teams need to know
            about generative engine optimization.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-emerald-50 text-emerald-700" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
