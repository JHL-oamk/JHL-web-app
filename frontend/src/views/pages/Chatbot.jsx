import React, { useEffect, useRef } from "react";
import { Bot, User, Reply } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { ChatbotSidebar } from '../components/ChatbotSidebar';
import colors from '../../config/colors';
import { useChatbotViewModel } from "../../viewModels/ChatbotViewModel";
import ReactMarkdown from "react-markdown";

export const Chatbot = ({ authViewModel }) => {
  const vm = useChatbotViewModel(authViewModel);
  
  // 1. SCROLL REFERENCE: To control the auto-scrolling of the message container
  const scrollRef = useRef(null);

  // 2. AUTO-SCROLL LOGIC: Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [vm.messages]);

  // Suggestions for the Welcome View
  const suggestions = [
    "Tell me something about the Finnish labor law...",
    "What should I do if I have law related problem at work place ?..."
  ];

  return (
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />
      
      <div className="flex h-[calc(100vh-50px)]">
        <ChatbotSidebar vm={vm} />

        <main className="flex flex-col flex-1" style={{ backgroundColor: colors.lightGrey }}>
          {/* Header */}
          <div className="px-20 py-6 bg-transparent">
            <h1 className="text-[14px] font-medium text-black">Legal Chatbot</h1>
          </div>

          {/* 3. MESSAGE STREAM - Attach scrollRef here */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto px-20 pb-6 scroll-smooth"
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
                          Hello! I am your law assistant, what can I help you today?
                        </h2>
                        <p className="text-[12px] text-gray-500 mb-6">
                          For quick start, select some topics below to start conversation...
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
                            a: ({ node, ...props }) => {
                              const isInternal = props.href === "#";
                              
                              if (isInternal) {
                                // FIX: Ensure full string is captured if markdown children are split
                                const fullLawName = React.Children.toArray(props.children).join("");

                                return (
                                  <span className="inline-flex items-start gap-2 my-2 group w-full">
                                    <Reply size={14} className="text-gray-400 rotate-180 mt-1" />
                                    <span className="flex flex-col">
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          // Toggle source ONLY
                                          vm.handleLawClick(fullLawName);
                                        }}
                                        className="text-[#3B82F6] font-bold hover:underline text-left inline-block"
                                      >
                                        {props.children}
                                      </button>
                                    </span>
                                  </span>
                                );
                              }
                              
                              return (
                                <a 
                                  href={props.href} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#3B82F6] underline inline-block ml-6 mt-1 break-all hover:opacity-70 text-[11px]"
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
          <div className="px-20 pb-8">
            <div className="bg-white rounded-2xl p-5 mx-auto w-[50vw] shadow-lg border border-gray-100">
              <div className="text-[11px] mb-3 font-medium" style={{ color: colors.darkGrey }}>
                Selected <span className="text-blue-600">{vm.selectedLaws.length || '0'}</span> sources
              </div>
              
              <div className="flex items-end gap-4">
                <textarea
                  placeholder="Write your question here..."
                  value={vm.input}
                  onChange={(e) => vm.setInput(e.target.value)}
                  className="flex-1 text-[12px] leading-relaxed min-h-[70px] outline-none resize-none"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && vm.handleSend()}
                />
                <button
                  onClick={() => vm.handleSend()}
                  className="h-[36px] px-6 rounded-full text-[12px] font-bold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Send
                </button>
              </div>
            </div>
            
            <p className="text-[10px] mt-2 text-center" style={{ color: colors.darkGrey }}>
              *AI may make mistakes, always check the law sources yourself.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};