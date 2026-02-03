package com.example.dbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
// 프런트엔드(Vite) 포트가 5173이므로 CORS 허용 설정을 추가합니다.
@CrossOrigin(origins = "http://localhost:5173")
public class SimvexController {

    // 3D 모델의 부품 이름과 설명을 매칭하는 간이 데이터베이스입니다.
    private static final Map<String, Map<String, String>> partDatabase = new HashMap<>();

    static {
        // Solid1: 베이스 기어
        addPart("solid1", "메인 베이스 기어", "시스템의 하중을 지지하고 회전축의 중심을 잡아주는 기초 기어입니다.");

        // Solid2: 예시 (실제 콘솔에 찍히는 이름을 확인 후 수정하세요)
        addPart("solid2", "상단 구동 기어", "모터로부터 전달받은 회전력을 가속하거나 감속하여 전달하는 부품입니다.");

        // Solid3: 예시
        addPart("solid3", "연결 샤프트", "서로 다른 기어 유닛을 연결하여 동력을 멀리 전달하는 축입니다.");
    }

    // 코드 중복을 줄이기 위한 간단한 헬퍼 메소드
    private static void addPart(String id, String title, String desc) {
        Map<String, String> info = new HashMap<>();
        info.put("title", title);
        info.put("description", desc);
        partDatabase.put(id.toLowerCase(), info);
    }

    /**
     * 1. 부품 정보 조회 API
     * React에서 부품을 클릭하면 해당 부품의 이름을 받아 상세 정보를 반환합니다.
     */
    @GetMapping("/parts/{name}")
    public ResponseEntity<Map<String, String>> getPartDetail(@PathVariable String name) {
        System.out.println("클릭된 부품 이름: " + name); // 인텔리제이 콘솔에서 확인용

        Map<String, String> info = partDatabase.get(name.toLowerCase());

        if (info == null) {
            info = new HashMap<>();
            info.put("title", name);
            info.put("description", "이 부품(" + name + ")에 대한 상세 공학 정보가 아직 등록되지 않았습니다.");
        }

        return ResponseEntity.ok(info);
    }

    /**
     * 2. AI 어시스턴트 질문 API (Mock 모드)
     * API 키가 없을 때를 대비하여 AI인 척 답변을 생성합니다.
     */
    @PostMapping("/ai/ask")
    public ResponseEntity<Map<String, String>> askAi(@RequestBody Map<String, String> request) {
        String question = request.get("question");
        String currentPart = request.get("currentPart");

        Map<String, String> response = new HashMap<>();

        // 실제 AI 응답을 흉내내는 로직
        String mockAnswer = String.format(
                "[SIMVEX AI 조수] 현재 분석 중인 부품은 '%s'입니다. 질문하신 '%s'에 대해 답변드리자면, " +
                        "해당 부품은 물리 시뮬레이션 상에서 응력 집중이 발생할 수 있는 구간이므로 설계 시 주의가 필요합니다.",
                currentPart, question
        );

        response.put("answer", mockAnswer);
        return ResponseEntity.ok(response);
    }
}