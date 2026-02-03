import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const categories = [
        { name: "기계공학", icon: "⚙️" },
        { name: "생명공학", icon: "🧬" },
        { name: "건축공학", icon: "🏗️" },
        { name: "전자공학", icon: "🔌" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* 1. GNB (Header) */}
            <nav className="flex items-center justify-between px-10 py-4 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-md z-50">
                <div className="text-2xl font-bold text-blue-500 tracking-tighter">SIMVEX</div>
                <div className="flex-1 mx-10">
                    <input
                        type="text"
                        placeholder="공학 실습 모델 검색..."
                        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-full px-5 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-6 text-sm font-medium">
                    <button className="hover:text-blue-400">로그인</button>
                    <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">회원가입</button>
                </div>
            </nav>

            {/* 2. 메인 배너 영역 */}
            <section className="relative h-[500px] w-full bg-gradient-to-r from-blue-900/20 to-purple-900/20 flex items-center px-20 border-b border-gray-800">
                <div className="z-10">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                        복잡한 공학 구조,<br/>
                        <span className="text-blue-500">3D 시각화</span>로 완벽하게 이해하세요.
                    </h1>
                    <p className="text-gray-400 mb-8 text-lg">AI 어시스턴트와 함께하는 차세대 공학 학습 플랫폼</p>
                    <button
                        onClick={() => navigate('/learning')}
                        className="bg-white text-black font-bold py-4 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/20"
                    >
                        무료로 시작하겠습니까?
                    </button>
                </div>
                <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-30">
                    <span className="text-[200px]">⚙️</span>
                </div>
            </section>

            {/* 3. 카테고리 섹션 */}
            <section className="py-20 px-20">
                <h2 className="text-2xl font-bold mb-10">전공 분야별 탐색</h2>
                <div className="grid grid-cols-4 gap-6">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            onClick={() => navigate('/learning')}
                            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-blue-500 hover:-translate-y-2 transition-all cursor-pointer text-center group"
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                            <div className="font-bold text-lg">{cat.name}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}