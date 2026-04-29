import { Bot, User } from "lucide-react";
import { Navbar } from '../components/Navbar';
import { ChatbotSidebar } from '../components/ChatbotSidebar';
import colors from '../../config/colors';
import { useChatbotViewModel } from "../../viewModels/ChatbotViewModel";

export const Chatbot = ({ authViewModel }) => {
  const vm = useChatbotViewModel(authViewModel);

  return (
    // Page shell with fixed navbar spacing.
    <div className="min-h-screen bg-white pt-[50px]">
      <Navbar authViewModel={authViewModel} />
      {/* Main two-column layout: sidebar + chat area. */}
      <div className="flex h-[calc(100vh-50px)]">
        <ChatbotSidebar vm={vm} />

        {/* Chat surface on light grey background. */}
        <main className="flex flex-col flex-1" style={{ backgroundColor: colors.lightGrey }}>
          {/* Section header */}
          <div className="px-20 py-6 bg-transparent">
            <h1 className="text-[14px] font-medium text-black">Legal Chatbot</h1>
          </div>

          {/* Scrollable message stream */}
          <div className="flex-1 overflow-y-auto px-20 pb-6">
            <div className="space-y-10 w-full">
              {vm.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`relative ${msg.role === "user" ? "w-[33vw] ml-auto mr-20" : "w-[50vw] mx-auto"}`}
                >
                  {/* Assistant avatar */}
                  {msg.role === "assistant" && (
                    <div
                      className="absolute -left-14 top-2 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.black }}
                    >
                      <Bot size={18} className="text-white" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className="w-full px-7 py-5 rounded-[28px] text-[12px] leading-relaxed"
                    style={{
                      backgroundColor: msg.role === "user" ? 'rgba(255,255,255,0.3)' : colors.white,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    }}
                  >
                    {msg.content}
                  </div>

                  {/* User avatar + name */}
                  {msg.role === "user" && (
                    <div className="absolute -right-15 top-1 flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.secondary }}
                      >
                        <User size={18} className="text-white" />
                      </div>
                      <span className="text-[10px]" style={{ color: colors.darkGrey }}>
                        {vm.authUser?.username || authViewModel?.user?.username || authViewModel?.user?.email || ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input composer */}
          <div className="px-20 pb-8">
            <div className="bg-white rounded-2xl p-5 mx-auto w-[50vw]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
              <div className="text-[11px] mb-3" style={{ color: colors.darkGrey }}>
                Selected {vm.selectedLaws.length ? vm.selectedLaws.length : '0'} sources
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
                  onClick={vm.handleSend}
                  className="h-[32px] px-5 rounded-full text-[12px] font-medium text-white"
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