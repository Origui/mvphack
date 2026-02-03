import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LearningPage() {
    const navigate = useNavigate();

    // DB 구조도의 Model Table 데이터를 본뜬 가짜 데이터입니다.
    const models = [
        { id: 1, title: "제트 엔진 구조 학습", category: "기계공학", thumbnail: "⚙️" },
        { id: 2, title: "DNA 이중 나선 분석", category: "생명공학", thumbnail: "🧬" },
        { id: 3, title: "고층 빌딩 하중 시뮬레이션", category: "건축공학", thumbnail: "🏗️" },
    ];

    return (
        <div className="p-10 bg-[#0a0a0a] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-10 text-blue-500">학습할 3D 오브젝트 선택</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {models.map((model) => (
                    <div
                        key={model.id}
                        onClick={() => navigate(`/study/${model.id}`)}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500 transition-all cursor-pointer group"
                    >
                        {/* 3D 미리보기 썸네일 영역 (기획안 1번) */}
                        <div className="h-48 bg-black flex items-center justify-center text-6xl group-hover:scale-125 transition-transform duration-500">
                            {model.thumbnail}
                        </div>

                        <div className="p-6">
                            <span className="text-xs text-blue-400 font-bold uppercase">{model.category}</span>
                            <h3 className="text-xl font-bold mt-2">{model.title}</h3>
                            <p className="text-gray-400 text-sm mt-2">클릭하여 3D 시뮬레이션을 시작합니다.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}