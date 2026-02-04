import React, { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Grid, ContactShadows, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

/* -------------------------------------------------------------------------- */
/* 하위 컴포넌트                                                              */
/* -------------------------------------------------------------------------- */

const ToolbarBtn = ({ icon, active, onClick, tooltip }) => (
    <button
        onClick={onClick}
        className={`group relative w-8 h-8 flex items-center justify-center rounded-md transition-all ${
            active ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <i className={`fa-solid ${icon} text-sm`}></i>
        {tooltip && (
            <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-slate-700 whitespace-nowrap pointer-events-none">
                {tooltip}
            </span>
        )}
    </button>
);

const ToolbarDivider = () => <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>;

function CameraRig({ targetPosition }) {
    const { controls } = useThree();
    useFrame(() => {
        if (targetPosition && controls) {
            controls.target.lerp(targetPosition, 0.1);
            controls.update();
        }
    });
    return null;
}

function DraggablePart({ part, explosion, isSelected, onSelect, transformMode, isVisible }) {
    const { scene } = useGLTF(part.url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const meshRef = useRef();

    if (!isVisible) return null;

    const currentPosition = [
        part.defaultPos[0] + part.direction[0] * explosion,
        part.defaultPos[1] + part.direction[1] * explosion,
        part.defaultPos[2] + part.direction[2] * explosion
    ];

    return (
        <>
            {isSelected && (
                <TransformControls
                    object={meshRef}
                    mode={transformMode}
                    onMouseUp={() => {
                        if (meshRef.current) {
                            const { x, y, z } = meshRef.current.position;
                            const { x: rx, y: ry, z: rz } = meshRef.current.rotation;
                            console.log(`\n🚀 [ID: ${part.id}] 데이터:`);
                            console.log(`defaultPos: [${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)}],`);
                            console.log(`rotation: [${rx.toFixed(4)}, ${ry.toFixed(4)}, ${rz.toFixed(4)}],`);
                        }
                    }}
                />
            )}
            <primitive
                ref={meshRef}
                object={clonedScene}
                position={currentPosition}
                rotation={part.rotation || [0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(part.id);
                }}
            />
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* 모델 데이터 구성                                                           */
/* -------------------------------------------------------------------------- */

const MODEL_DATA = {
    "1": {
        name: "Jet Engine Assembly",
        parts: [
            { id: "base_gear", url: "/models/BaseGear.glb", defaultPos: [0.0076, 0.0178, -0.0027], direction: [0, -0.2, 0], rotation: [0, -1.5706, 0] },
            { id: "mounting_bracket", url: "/models/BaseMountingbracket.glb", defaultPos: [0.0101, -0.0053, 0.0060], direction: [0, 0.2, 0], rotation: [-0.1133, 1.5241, 1.6775] },
            { id: "base_plate", url: "/models/BasePlate.glb", defaultPos: [0, 0, 0], direction: [0, -0.2, 0], rotation: [0, 0, 0] },
            { id: "gear_link_1", url: "/models/Gearlink1.glb", defaultPos: [0.0136, 0.0378, 0.0048], direction: [0.2, 0.2, 0], rotation: [1.5754, -0.0569, -1.5434] },
            { id: "gear_link_2", url: "/models/Gearlink2.glb", defaultPos: [-0.0136, 0.0378, 0.0062], direction: [-0.2, 0.2, 0], rotation: [-3.1374, -0.0061, -1.7756] },
            { id: "link_L", url: "/models/Link.glb", defaultPos: [-0.15, 0.2, 0], direction: [-0.3, 0.1, 0], rotation: [0, 0, 0] },
            { id: "link_R", url: "/models/Link.glb", defaultPos: [0.15, 0.2, 0], direction: [0.3, 0.1, 0], rotation: [0, 0, 0] },
            { id: "gripper_L", url: "/models/Gripper.glb", defaultPos: [-0.2, 0.25, 0.05], direction: [-0.3, 0, 0.2], rotation: [0, 0, 0] },
            { id: "gripper_R", url: "/models/Gripper.glb", defaultPos: [0.2, 0.25, 0.05], direction: [0.3, 0, 0.2], rotation: [0, 0, 0] },
            { id: "Pin_01", url: "/models/Pin.glb", defaultPos: [0.0053, 0.0575, 0.0024], direction: [0.2, 0.2, 0.2], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_02", url: "/models/Pin.glb", defaultPos: [-0.0043, 0.0574, 0.0023], direction: [-0.2, 0.2, 0.2], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_03", url: "/models/Pin.glb", defaultPos: [0.03, 0.08, 0.0024], direction: [0.2, 0.2, -0.2], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_04", url: "/models/Pin.glb", defaultPos: [-0.03, 0.08, 0.0024], direction: [-0.2, 0.2, -0.2], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_05", url: "/models/Pin.glb", defaultPos: [0.06, 0.08, 0.0024], direction: [0.3, 0.1, 0], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_06", url: "/models/Pin.glb", defaultPos: [-0.0136, 0.0377, 0.0025], direction: [0, 0.1, 0.3], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_07", url: "/models/Pin.glb", defaultPos: [0.0141, 0.0377, 0.0025], direction: [0, 0.1, 0.3], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_08", url: "/models/Pin.glb", defaultPos: [0, 0.08, 0.0024], direction: [0, 0.1, -0.3], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_09", url: "/models/Pin.glb", defaultPos: [0.0053, 0.0034, 0.0022], direction: [0.1, 0, 0.2], rotation: [Math.PI, -1.5402, Math.PI] },
            { id: "Pin_10", url: "/models/Pin.glb", defaultPos: [-0.0053, 0.0034, 0.0022], direction: [-0.1, 0, 0.2], rotation: [Math.PI, -1.5402, Math.PI] },
        ]
    },
    "2": {
        name: "Drone Assembly",
        parts: [
            { id: "Main_Frame", url: "/models/Main frame.glb", defaultPos: [0, 0.1, 0], direction: [0, 0, 0], rotation: [-1.5646, 0, 0] },
            { id: "Main_Frame_Mirror", url: "/models/Main frame_MIR.glb", defaultPos: [0, 0.1, 0], direction: [0, 0.2, 0], rotation: [-1.5646, 0, 0] },
            { id: "Arm_Gear_LF", url: "/models/Arm gear.glb", defaultPos: [-0.0812, 0.0888, -0.1776], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Arm_Gear_RF", url: "/models/Arm gear.glb", defaultPos: [0.0812, 0.0888, -0.1776], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Arm_Gear_LB", url: "/models/Arm gear.glb", defaultPos: [-0.0974, 0.0882, 0.0148], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Arm_Gear_RB", url: "/models/Arm gear.glb", defaultPos: [0.0974, 0.0882, 0.0148], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Gearing_Unit_LF", url: "/models/Gearing.glb", defaultPos: [-0.0733, 0.0834, -0.1667], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Gearing_Unit_RF", url: "/models/Gearing.glb", defaultPos: [0.0733, 0.0834, -0.1667], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Gearing_Unit_LB", url: "/models/Gearing.glb", defaultPos: [-0.0850, 0.0824, 0.0093], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Gearing_Unit_RB", url: "/models/Gearing.glb", defaultPos: [0.0850, 0.0824, 0.0093], direction: [0, 0.2, 0], rotation: [0, 0, 0] },
            { id: "Beater_Disc", url: "/models/Beater disc.glb", defaultPos: [0.0000, 0.1009, -0.1637], direction: [0, 0.1, 0], rotation: [-0.0000, -1.5463, 1.5650] },
            { id: "Impellar_Blade_LF", url: "/models/Impellar Blade.glb", defaultPos: [-0.0809, 0.1091, -0.1778], direction: [0, 0.3, 0], rotation: [0, 0, 0] },
            { id: "Impellar_Blade_RF", url: "/models/Impellar Blade.glb", defaultPos: [0.0809, 0.1091, -0.1778], direction: [0, 0.3, 0], rotation: [0, 0, 0] },
            { id: "Impellar_Blade_LB", url: "/models/Impellar Blade.glb", defaultPos: [-0.0975, 0.1085, 0.0147], direction: [0, 0.3, 0], rotation: [0, 0, 0] },
            { id: "Impellar_Blade_RB", url: "/models/Impellar Blade.glb", defaultPos: [0.0975, 0.1085, 0.0147], direction: [0, 0.3, 0], rotation: [0, 0, 0] },
            { id: "Support_Leg_LF", url: "/models/Leg.glb", defaultPos: [-0.0812, 0.1000, -0.1776], direction: [0, 0.1, 0], rotation: [0.0000, 0.6391, 0.0000] },
            { id: "Support_Leg_RF", url: "/models/Leg.glb", defaultPos: [0.0812, 0.1000, -0.1776], direction: [0, 0.1, 0], rotation: [0.0000, -0.6391, 0.0000] },
            { id: "Support_Leg_LB", url: "/models/Leg.glb", defaultPos: [-0.0973, 0.0990, 0.0146], direction: [0, 0.1, 0], rotation: [-3.1416, 1.1787, -3.1416] },
            { id: "Support_Leg_RB", url: "/models/Leg.glb", defaultPos: [0.0973, 0.0990, 0.0146], direction: [0, 0.1, 0], rotation: [-3.1416, -1.1787, -3.1416] },
            { id: "Fixing_Screw_LF", url: "/models/Screw.glb", defaultPos: [-0.0515, 0.0948, -0.1369], direction: [0, -0.4, 0], rotation: [0.0000, 0.0000, -3.15] },
            { id: "Fixing_Screw_RF", url: "/models/Screw.glb", defaultPos: [0.0515, 0.0948, -0.1369], direction: [0, -0.4, 0], rotation: [0.0000, 0.0000, -3.15] },
            { id: "Fixing_Screw_LB", url: "/models/Screw.glb", defaultPos: [0.0513, 0.0939, -0.0051], direction: [0, -0.4, 0], rotation: [0.0000, 0.0000, -3.15] },
            { id: "Fixing_Screw_RB", url: "/models/Screw.glb", defaultPos: [-0.0513, 0.0939, -0.0051], direction: [0, -0.4, 0], rotation: [0.0000, 0.0000, -3.15] },
            { id: "Fixing_Nut_LF", url: "/models/Nut.glb", defaultPos: [-0.0514, 0.1061, -0.1372], direction: [0, 0.4, 0], rotation: [0, 0, 0] },
            { id: "Fixing_Nut_RF", url: "/models/Nut.glb", defaultPos: [0.0514, 0.1061, -0.1372], direction: [0, 0.4, 0], rotation: [0, 0, 0] },
            { id: "Fixing_Nut_LB", url: "/models/Nut.glb", defaultPos: [-0.0514, 0.1061, -0.0048], direction: [0, 0.4, 0], rotation: [0, 0, 0] },
            { id: "Fixing_Nut_RB", url: "/models/Nut.glb", defaultPos: [0.0514, 0.1061, -0.0048], direction: [0, 0.4, 0], rotation: [0, 0, 0] },
        ]
    },
    "3": {
        name: "Leaf Spring",
        parts: [
            { id: "Chassis", url: "/models/Support-Chassis.glb", defaultPos: [-0.0064, 0.2511, -0.6397], direction: [0, 10, 0], rotation: [3.1402, 0.0000, 0.0000] },
            { id: "Chassis_Rigid", url: "/models/Support-Chassis Rigid.glb", defaultPos: [-0.0081, 0.1658, 0.4534], direction: [0, 10, 0], rotation: [-3.1381, 0.0000, 0.0000] },
            { id: "Leaf_Layer", url: "/models/Leaf-Layer.glb", defaultPos: [0, 0.13, 0], direction: [0, 5, 0], rotation: [0, 0, 0] },
            { id: "Clamp_Center", url: "/models/Clamp-Center.glb", defaultPos: [0.0798, 0.0535, -0.0008], direction: [0, -5, 0], rotation: [0, 0, 0] },
            { id: "Clamp_Primary_L", url: "/models/Clamp-Primary.glb", defaultPos: [0.0837, 0.0632, 0.1287], direction: [0, -5, 0], rotation: [-0.0650, 0.0000, 0.0000] },
            { id: "Clamp_Primary_R", url: "/models/Clamp-Primary.glb", defaultPos: [0.0837, 0.0632, -0.1287], direction: [0, -5, 0], rotation: [0.0650, 0.0000, 0.0000] },
            { id: "Clamp_Secondary_L", url: "/models/Clamp-Secondary.glb", defaultPos: [0.0835, 0.0928, 0.2816], direction: [0, -5, 0], rotation: [-0.1597, 0.0000, 0.0000] },
            { id: "Clamp_Secondary_R", url: "/models/Clamp-Secondary.glb", defaultPos: [0.0837, 0.0961, -0.2731], direction: [0, -5, 0], rotation: [0.1597, 0.0000, 0.0000] },
            { id: "SupportL", url: "/models/Support.glb", defaultPos: [0.0775, 0.2105, -0.5994], direction: [0, -10, 0], rotation: [1.9142, -1.5582, 3.1416] },
            { id: "SupportR", url: "/models/Support.glb", defaultPos: [-0.0006, 0.2562, -0.5829], direction: [0, -10, 0], rotation: [1.9142, 1.5582, 3.1416] },
            { id: "Rubber", url: "/models/Support-Rubber 60mm.glb", defaultPos: [0.0074, 0.2494, -0.6404], direction: [0, -15, 0], rotation: [0, 0, 0] },
        ]
    },
    "4": {
        name: "Machine Vice",
        parts: [
            { id: "Fuhrung", url: "/models/Part1 Fuhrung.glb", defaultPos: [-0.1601, 0.1301, -0.0107], direction: [0, 10, 0], rotation: [-1.5724, 0.0000, 0.0000] },
            { id: "Part1m", url: "/models/Part1.glb", defaultPos: [0, 0, 0], direction: [0, 10, 0], rotation: [0, 0, 0] },
            { id: "Part2m", url: "/models/Part2 Feste Backe.glb", defaultPos: [-0.1854, 0.0996, -0.0004], direction: [0, 5, 0], rotation: [3.1347, 1.5686, -3.1402] },
            { id: "Part3m", url: "/models/Part3-lose backe.glb", defaultPos: [-0.0456, 0.1361, -0.0005], direction: [0, -5, 0], rotation: [0.0000, 1.5678, 0.0000] },
            { id: "Part4m", url: "/models/Part4 spindelsockel.glb", defaultPos: [-0.0201, 0.1001, -0.0205], direction: [0, -5, 0], rotation: [0.0000, 1.5662, 0.0000] },
            { id: "Part5-1m", url: "/models/Part5-Spannbacke.glb", defaultPos: [-0.0885, 0.1361, -0.0765], direction: [0, -5, 0], rotation: [0.0000, -1.5670, 0.0000] },
            { id: "Part5-2m", url: "/models/Part5-Spannbacke.glb", defaultPos: [-0.1678, 0.1353, 0.0001], direction: [0, -5, 0], rotation: [-3.1416, 1.5658, -3.1416] },
            { id: "Part6m", url: "/models/Part6-fuhrungschiene.glb", defaultPos: [0, 0, 0], direction: [0, -5, 0], rotation: [0, 0, 0] },
            { id: "Part7m", url: "/models/Part7-TrapezSpindel.glb", defaultPos: [0.0745, 0.1442, -0.0381], direction: [0, -5, 0], rotation: [-3.1416, 1.5688, -3.1416] },
            { id: "Part8m", url: "/models/Part8-grundplatte.glb", defaultPos: [0, 0.1, 0], direction: [0, -10, 0], rotation: [1.5758, -0.0000, -3.1402] },
            { id: "Part9m", url: "/models/Part9-Druckhulse.glb", defaultPos: [0.0010, 0.1074, -0.0485], direction: [0, -10, 0], rotation: [0.0000, -1.5649, 0.0000] },
        ]
    },
    "5": {
        name: "Robot Arm",
        parts: [
            { id: "Base", url: "/models/base.glb", defaultPos: [0, 0, 0], direction: [0, 10, 0], rotation: [0, 0, 0] },
            { id: "Part2r", url: "/models/Part2.glb", defaultPos: [0.0000, 0.0821, -0.0000], direction: [0, 10, 0], rotation: [0.0000, 1.5550, 0.0000] },
            { id: "Part3r", url: "/models/Part3.glb", defaultPos: [0.1498, 0.2422, 0.0222], direction: [0, 5, 0], rotation: [1.5615, -0.6519, -0.0056] },
            { id: "Part4r", url: "/models/Part4.glb", defaultPos: [-0.1810, 0.4973, -0.0253], direction: [0, -5, 0], rotation: [-1.9292, 1.5260, 1.9288] },
            { id: "Part5r", url: "/models/Part5.glb", defaultPos: [0.1150, 0.5099, -0.0298], direction: [0, -5, 0], rotation: [-1.6017, 1.5257, 1.6016] },
            { id: "Part6r", url: "/models/Part6.glb", defaultPos: [0.2629, 0.4971, -0.0299], direction: [0, -5, 0], rotation: [-1.5645, 0.4378, 1.5615] },
            { id: "Part7r", url: "/models/Part7.glb", defaultPos: [0.3098, 0.4755, -0.0293], direction: [0, -5, 0], rotation: [1.5474, 1.1308, -1.5497] },
            { id: "Part8-1r", url: "/models/Part8.glb", defaultPos: [0.3951, 0.4262, 0.0002], direction: [0, -5, 0], rotation: [-1.5298, 0.4342, 1.2922] },
            { id: "Part8-2r", url: "/models/Part8.glb", defaultPos: [0.4023, 0.4414, -0.0569], direction: [0, -5, 0], rotation: [1.5767, -0.4456, 1.3316] },
        ]
    }
};

/* -------------------------------------------------------------------------- */
/* 메인 페이지 컴포넌트                                                       */
/* -------------------------------------------------------------------------- */

export default function StudyPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 현재 활성화된 모델 선택 (기본값 1)
    const currentModel = useMemo(() => MODEL_DATA[id] || MODEL_DATA["1"], [id]);
    const assemblyParts = currentModel.parts;

    // 상태 관리
    const [explosion, setExplosion] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const [transformMode, setTransformMode] = useState("translate");
    const [visibleParts, setVisibleParts] = useState({});
    const [checkedGroups, setCheckedGroups] = useState({});
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [userNote, setUserNote] = useState('');

    // 모델 변경 시 초기화
    useEffect(() => {
        const initialVisibility = {};
        assemblyParts.forEach(p => initialVisibility[p.id] = true);
        setVisibleParts(initialVisibility);
        setExplosion(0);
        setSelectedId(null);
        setCheckedGroups({});
    }, [id, assemblyParts]);

    // 그룹화 로직 (사이드바 리스트 출력용)
    const groupedParts = useMemo(() => {
        const groups = {};
        assemblyParts.forEach(part => {
            if (!groups[part.url]) groups[part.url] = [];
            groups[part.url].push(part);
        });
        return groups;
    }, [assemblyParts]);

    const getPartName = (url) => url.split('/').pop().replace('.glb', '');

    const toggleGroupVisibility = (url) => {
        const parts = groupedParts[url];
        const isCurrentlyVisible = visibleParts[parts[0].id];
        const nextStatus = !isCurrentlyVisible;
        const updated = { ...visibleParts };
        parts.forEach(p => updated[p.id] = nextStatus);
        setVisibleParts(updated);
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-[#020617] text-[#f8fafc] overflow-hidden font-sans">
            {/* 상단 헤더 */}
            <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black text-sky-400 italic cursor-pointer" onClick={() => navigate('/')}>SIMVEX</h1>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => navigate('/study/1')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${id === '1' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >JET ENGINE</button>
                        <button
                            onClick={() => navigate('/study/2')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${id === '2' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >DRONE</button>
                        <button
                            onClick={() => navigate('/study/3')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${id === '3' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >Leaf Spring</button>
                        <button
                            onClick={() => navigate('/study/4')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${id === '4' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >Machine Vice</button>
                        <button
                            onClick={() => navigate('/study/5')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${id === '5' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >Robot Arm</button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {/* 왼쪽 사이드바: 부품 리스트 */}
                <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col z-40">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-sky-500 tracking-widest uppercase italic">Components</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {Object.entries(groupedParts).map(([url, parts]) => {
                            const name = getPartName(url);
                            const isVisible = visibleParts[parts[0].id];
                            return (
                                <div
                                    key={url}
                                    className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${selectedId === parts[0].id ? 'bg-sky-500/10 border border-sky-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                    onClick={() => setSelectedId(parts[0].id)}
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        <input
                                            type="checkbox"
                                            checked={checkedGroups[url] || false}
                                            onChange={() => setCheckedGroups(prev => ({...prev, [url]: !prev[url]}))}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-3.5 h-3.5 accent-sky-500 rounded"
                                        />
                                        <span className={`text-[11px] font-bold truncate ${selectedId === parts[0].id ? 'text-sky-400' : 'text-slate-400'}`}>
                                            {name} {parts.length > 1 && <span className="text-[9px] opacity-50 ml-1">x{parts.length}</span>}
                                        </span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); toggleGroupVisibility(url); }}>
                                        <i className={`fa-solid ${isVisible ? 'fa-eye' : 'fa-eye-slash'} text-[10px] text-slate-500`}></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* 중앙 3D 뷰포트 영역 */}
                <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]">
                    {/* CAD 스타일 툴바 */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg flex p-1 shadow-2xl gap-1">
                        <ToolbarBtn icon="fa-arrow-pointer" active={transformMode === 'translate'} onClick={() => setTransformMode('translate')} tooltip="Move (T)" />
                        <ToolbarBtn icon="fa-rotate" active={transformMode === 'rotate'} onClick={() => setTransformMode('rotate')} tooltip="Rotate (R)" />
                        <ToolbarDivider />
                        <ToolbarBtn icon="fa-camera" tooltip="Screenshot" />
                        <ToolbarBtn icon="fa-ruler-combined" tooltip="Measure" />
                        <ToolbarBtn icon="fa-gear" tooltip="Settings" />
                    </div>

                    <Canvas shadows camera={{ position: [0.8, 0.8, 0.8], fov: 35 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.6} />
                            <pointLight position={[5, 5, 5]} intensity={1.5} />
                            <Grid infiniteGrid cellSize={0.01} sectionSize={0.05} sectionColor="#38bdf8" cellColor="#0f172a" opacity={0.2} />
                            <group>
                                {assemblyParts.map((part) => (
                                    <DraggablePart
                                        key={part.id}
                                        part={part}
                                        explosion={explosion}
                                        isSelected={selectedId === part.id}
                                        onSelect={setSelectedId}
                                        transformMode={transformMode}
                                        isVisible={visibleParts[part.id]}
                                    />
                                ))}
                            </group>
                            <ContactShadows position={[0, -0.05, 0]} opacity={0.4} scale={3} />
                            <Environment preset="night" />
                        </Suspense>
                        <OrbitControls makeDefault minDistance={0.1} maxDistance={5} />
                    </Canvas>

                    {/* 폭발도 슬라이더 */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/10 z-30">
                        <input
                            type="range" min="0" max="0.5" step="0.001"
                            value={explosion}
                            onChange={(e) => setExplosion(parseFloat(e.target.value))}
                            className="w-full h-1 accent-sky-500 cursor-pointer"
                        />
                        <p className="text-[9px] text-center mt-2 text-slate-500 uppercase tracking-widest">Exploded View Control</p>
                    </div>

                    {/* 노트 시스템 */}
                    <button
                        onClick={() => setIsNoteOpen(!isNoteOpen)}
                        className={`absolute bottom-8 right-8 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all z-50 ${isNoteOpen ? 'bg-white text-black rotate-45' : 'bg-sky-500 text-white hover:scale-110'}`}
                    >
                        <i className={`fa-solid ${isNoteOpen ? 'fa-plus' : 'fa-pen-to-square'}`}></i>
                    </button>

                    <div className={`absolute top-0 right-0 h-full bg-slate-900/95 border-l border-white/10 transition-all duration-300 z-40 backdrop-blur-xl ${isNoteOpen ? 'w-80' : 'w-0 overflow-hidden opacity-0'}`}>
                        <div className="p-6 w-80 flex flex-col h-full">
                            <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-4">Engineering Note</h3>
                            <textarea
                                value={userNote}
                                onChange={(e) => setUserNote(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none focus:border-sky-500 resize-none"
                                placeholder="분석 내용을 기록하세요..."
                            />
                            <button className="mt-4 w-full py-3 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-bold">Save Note</button>
                        </div>
                    </div>
                </section>

                {/* 오른쪽 AI 분석 패널 */}
                <aside className="w-80 bg-slate-950 border-l border-white/5 flex flex-col z-50 hidden lg:flex">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="text-[10px] font-black text-sky-500 tracking-widest uppercase italic">AI Analyst</h3>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto">
                        <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl mb-4">
                            <p className="text-[11px] leading-relaxed text-sky-100/80">
                                {selectedId ? `현재 선택된 [${selectedId}] 부품의 조립 공차 및 간섭 체크를 진행할 수 있습니다.` : "분석할 부품을 선택하거나 체크박스를 활성화하세요."}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900/50">
                        <div className="relative">
                            <input type="text" placeholder="AI에게 질문..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs outline-none focus:border-sky-500" />
                            <i className="fa-solid fa-paper-plane absolute right-4 top-1/2 -translate-y-1/2 text-sky-500 cursor-pointer"></i>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

// 잊지 말고 useGLTF.preload를 통해 모델을 미리 로드하세요 (성능 최적화)
// Object.values(MODEL_DATA).forEach(model => model.parts.forEach(p => useGLTF.preload(p.url)));