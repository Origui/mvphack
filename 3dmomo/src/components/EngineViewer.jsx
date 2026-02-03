// src/components/EngineViewer.jsx
import { useGLTF } from '@react-three/drei';
import axios from 'axios';

export function EngineViewer() {
    const { scene } = useGLTF('/models/BaseGear.glb'); // public 폴더에 위치

    const handlePointerDown = async (event) => {
        event.stopPropagation(); // 이벤트 전파 방지
        const partName = event.object.name; // 모델링 시 설정한 부품 이름

        // 백엔드 API 호출
        const response = await axios.get(`http://localhost:8080/api/parts/${partName}`);
        console.log("부품 정보:", response.data);
        // 이 데이터를 상위 컴포넌트의 AI 채팅창이나 메모장 상태로 전달
    };

    return <primitive object={scene} onPointerDown={handlePointerDown} />;
}