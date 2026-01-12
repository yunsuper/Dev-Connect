// 나중에 '랜딩 페이지'를 따로 만들고 싶다면, 주석 풀기
// "use client";

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useChatStore } from "@/store/useChatStore";
// import { getRandomNickname } from "@/lib/utils";

// // 컴포넌트 경로 최적화 (기존 chat 폴더와 새 dashboard 폴더 구분)
// import Header from "@/components/chat/Header";
// import ChatList from "@/components/chat/ChatList";
// import ChatInput from "@/components/chat/ChatInput";

// import ActiveUserList from "@/components/dashboard/ActiveUserList";
// import FeedSection from "@/components/dashboard/FeedSection";
// import TodoList from "@/components/dashboard/TodoList";
// import PomodoroTimer from "@/components/dashboard/PomodoroTimer";

// export default function DashboardPage() {
//     const { messages, onlineUsers, fetchMessages, subscribeMessages } =
//         useChatStore();
//     const [myNickname, setMyNickname] = useState("");
//     const [mounted, setMounted] = useState(false);
//     const unsubscribeRef = useRef<(() => void) | null>(null);

//     useEffect(() => {
//         setMounted(true);
//         const initialName = getRandomNickname();
//         setMyNickname(initialName);

//         fetchMessages();
//         if (unsubscribeRef.current) unsubscribeRef.current();
//         unsubscribeRef.current = subscribeMessages(initialName);

//         return () => {
//             if (unsubscribeRef.current) {
//                 unsubscribeRef.current();
//                 unsubscribeRef.current = null;
//             }
//         };
//     }, [fetchMessages, subscribeMessages]);

//     const handleRefreshNickname = useCallback(() => {
//         const newName = getRandomNickname();
//         setMyNickname(newName);
//         if (unsubscribeRef.current) unsubscribeRef.current();
//         unsubscribeRef.current = subscribeMessages(newName);
//     }, [subscribeMessages]);

//     if (!mounted) return null;

//     return (
//         // 1. 전체 배경: globals.css의 --color-background 사용
//         <main className="flex h-screen w-full bg-background text-foreground overflow-hidden">
//             {/* 2. 왼쪽: 사이드바 유틸리티 클래스 적용 */}
//             <aside className="w-64 sidebar-container border-r hidden lg:flex">
//                 <div className="p-4 border-b border-zinc-800 font-bold text-zinc-500 text-xs tracking-widest">
//                     ONLINE DEVELOPERS ({onlineUsers})
//                 </div>
//                 <div className="flex-1 overflow-y-auto custom-scrollbar">
//                     <ActiveUserList />
//                 </div>
//             </aside>

//             {/* 3. 가운데: 메인 컨텐츠 영역 */}
//             <section className="flex-1 flex flex-col min-w-0">
//                 <Header
//                     myNickname={myNickname}
//                     onRefresh={handleRefreshNickname}
//                     messageCount={messages.length}
//                     onlineCount={onlineUsers}
//                 />

//                 <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
//                     {/* 채팅 섹션: dev-panel 클래스 활용 */}
//                     <div className="dev-panel rounded-xl flex flex-col h-[550px] overflow-hidden">
//                         <div className="flex-1 overflow-hidden flex flex-col p-2">
//                             <ChatList myNickname={myNickname} />
//                         </div>
//                         <div className="p-4 border-t border-zinc-800 bg-black/20">
//                             <ChatInput nickname={myNickname} />
//                         </div>
//                     </div>

//                     {/* 피드 섹션: dev-panel 클래스 활용 */}
//                     <div className="dev-panel rounded-xl p-6">
//                         <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
//                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
//                             Code Feed
//                         </h3>
//                         <FeedSection />
//                     </div>
//                 </div>
//             </section>

//             {/* 4. 오른쪽: 유틸리티 사이드바 */}
//             <aside className="w-80 sidebar-container border-l hidden xl:flex p-4 space-y-6">
//                 <div className="dev-panel p-5 rounded-xl">
//                     <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
//                         Focus Timer
//                     </h3>
//                     <PomodoroTimer />
//                 </div>

//                 <div className="dev-panel flex-1 p-5 rounded-xl overflow-hidden flex flex-col">
//                     <h3 className="text-xs font-bold text-zinc-500 mb-4 tracking-tighter uppercase">
//                         Task Board
//                     </h3>
//                     <div className="flex-1 overflow-y-auto custom-scrollbar">
//                         <TodoList />
//                     </div>
//                 </div>
//             </aside>
//         </main>
//     );
// }
