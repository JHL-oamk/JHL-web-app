import React, { useEffect, useRef } from "react";
import { Bot, User, Reply } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { ChatbotSidebar } from '../components/ChatbotSidebar';
import colors from '../../config/colors';
import { useChatbotViewModel } from "../../viewModels/ChatbotViewModel";
import ReactMarkdown from "react-markdown";
import { useTranslation } from 'react-i18next';

export const Chatbot = ({ authViewModel }) => {
  const vm = useChatbotViewModel(authViewModel);
  const { t } = useTranslation();
  
  // 1. SCROLL REFERENCE: To control the auto-scrolling of the message container
  const scrollRef = useRef(null);

  // 2. AUTO-SCROLL LOGIC: Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [vm.messages]);

  // Suggestions for the Welcome View
  const suggestions = t('chatbot.suggestions', { returnObjects: true });

  return (
    <div className="h-screen bg-white pt-[50px] overflow-hidden">
      <Navbar authViewModel={authViewModel} />
      
      <div className="flex h-[calc(100vh-50px)]">
        <ChatbotSidebar vm={vm} />

        <main className="flex flex-col flex-1" style={{ backgroundColor: colors.lightGrey }}>
          {/* Header */}
          
          {/* 3. MESSAGE STREAM - Attach scrollRef here */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto px-5 pb-1 pt-6 scroll-smooth"
                >
            <div className="space-y-10 w-full">
              {vm.messages.map((msg, index) => {
                
                // CASE A: PERSISTENT WELCOME VIEW (Suggestion Keywords)
                if (msg.content === "WELCOME_VIEW") {
                  return (
                    <div key={index} className="w-[50vw] mx-auto relative">
                      <div
                        className="absolute -left-14 top-2 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: colors.black }}
                      >
                        <Bot size={18} className="text-white" />
                      </div>

                      <div className="w-full px-7 py-6 rounded-[28px] bg-white shadow-sm border border-gray-100">
                        <h2 className="text-[14px] font-semibold text-black mb-1">
                          {t('chatbot.welcome_title')}
                        </h2>
                        <p className="text-[12px] text-gray-500 mb-6">
                          {t('chatbot.welcome_subtitle')}
                        </p>
                        
                        <div className="flex flex-col gap-3">
                          {suggestions.map((text, idx) => (
                            <button
                              key={idx}
                              onClick={() => vm.handleSuggestionClick(text)}
                              className="flex items-center gap-3 w-fit hover:opacity-60 transition-all group"
                            >
                              <Reply size={16} className="text-gray-400 rotate-180 group-hover:text-[#3B82F6]" />
                              <span className="text-[#3B82F6] font-medium text-[13px] text-left">
                                {text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // CASE B: STANDARD MESSAGE BUBBLES
                return (
                  <div
                    key={index}
                    className={`relative ${msg.role === "user" ? "w-[33vw] ml-auto mr-20" : "w-[50vw] mx-auto"}`}
                  >
                    {/* Assistant Avatar */}
                    {msg.role === "assistant" && (
                      <div
                        className="absolute -left-14 top-2 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: colors.black }}
                      >
                        <Bot size={18} className="text-white" />
                      </div>
                    )}

                    {/* Message Bubble Content */}
                    <div
                      className="w-full px-7 py-5 rounded-[28px] text-[12px] leading-relaxed shadow-sm bg-white"
                      style={{
                        backgroundColor: msg.role === "user" ? 'rgba(255,255,255,0.4)' : colors.white,
                      }}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ node, ...props }) => {
                              const childrenArray = React.Children.toArray(props.children);
                              const hasPublishedDate = childrenArray.some(
                                (child) =>
                                  typeof child === 'string' && child.includes('Published Date')
                              );

                              if (hasPublishedDate) {
                                return (
                                  <p className="text-[13px] leading-relaxed text-black mb-4 last:mb-0 flex flex-wrap items-center gap-3">
                                    {childrenArray.map((child, idx) => {
                                      if (typeof child === 'string' && child.includes('Published Date')) {
                                        return (
                                          <span key={idx} style={{ color: colors.darkGrey }}>
                                            {child}
                                          </span>
                                        );
                                      }
                                      return <span key={idx}>{child}</span>;
                                    })}
                                  </p>
                                );
                              }

                              return (
                                <p className="text-[13px] leading-relaxed text-black mb-4 last:mb-0">
                                  {props.children}
                                </p>
                              );
                            },
                            hr: () => (
                              <hr className="my-6 border-t border-gray-200" />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold text-black">{props.children}</strong>
                            ),
                            a: ({ node, ...props }) => {
                              const isInternal = props.href === "#";
                              
                              if (isInternal) {
                                // FIX: Ensure full string is captured if markdown children are split
                                const fullLawName = React.Children.toArray(props.children).join("");

                                return (
                                  <span className="inline-flex items-start gap-2 my-1 mr-4 group">
                                    <Reply size={14} className="text-gray-400 rotate-180 mt-1" />
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        // Toggle source ONLY
                                        vm.handleLawClick(fullLawName);
                                      }}
                                      className="text-[#3B82F6] font-medium hover:underline text-left inline-block text-[13px]"
                                    >
                                      {props.children}
                                    </button>
                                  </span>
                                );
                              }
                              
                              return (
                                <a 
                                  href={props.href} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#1E88E5] underline block ml-7 mt-1 max-w-[360px] truncate hover:opacity-70 text-[12px]"
                                >
                                  {props.children}
                                </a>
                              );
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* User Avatar & Name Labels */}
                    {msg.role === "user" && (
                      <div className="absolute -right-15 top-1 flex flex-col items-center gap-1">
                        <div
                          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center shadow-sm"
                          style={{ backgroundColor: colors.secondary }}
                        >
                          <User size={18} className="text-white" />
                        </div>
                        <span className="text-[10px]" style={{ color: colors.darkGrey }}>
                          {vm.authUser?.username || authViewModel?.user?.username || 'User'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="pb-2 pt-2 pr-4 mt-auto">
            <div className="bg-white rounded-3xl p-3 mx-auto w-[50vw] shadow-md border border-gray-100">
              <div className="text-[11px] mb-3 font-medium" style={{ color: colors.darkGrey }}>
                {t('chatbot.selected_sources')} <span className="text-blue-600">{vm.selectedLaws.length || '0'}</span> {t('chatbot.sources_label')}
              </div>
              
              <div className="flex items-end gap-4">
                <textarea
                  placeholder={t('chatbot.placeholder')}
                  value={vm.input}
                  onChange={(e) => vm.setInput(e.target.value)}
                  className="flex-1 text-[14px] leading-relaxed min-h-[40px] outline-none resize-none"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && vm.handleSend()}
                />
                <button
                  onClick={() => vm.handleSend()}
                  className="h-[36px] px-6 rounded-full text-[12px] font-bold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  {t('chatbot.send')}
                </button>
              </div>
            </div>
            
            <p className="text-[10px] mt-2 text-center" style={{ color: colors.darkGrey }}>
              {t('chatbot.disclaimer')}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
