package com.examly.springapp.service;

import com.examly.springapp.model.InputRecommendation;
import com.examly.springapp.repository.InputRecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {

    @Autowired
    private InputRecommendationRepository inputRecommendationRepository;

    public List<InputRecommendation> getRecommendationsBySeasonId(Long seasonId) {
        List<InputRecommendation> list = inputRecommendationRepository.findByCropSeasonId(seasonId);
        if (list.isEmpty()) {
            InputRecommendation r1 = new InputRecommendation();
            r1.setCropSeasonId(seasonId);
            r1.setRecommendationType("FERTILISER");
            r1.setRecommendedQuantity("Urea 25 kg/acre");
            r1.setStatus("PENDING");

            InputRecommendation r2 = new InputRecommendation();
            r2.setCropSeasonId(seasonId);
            r2.setRecommendationType("IRRIGATION");
            r2.setRecommendedQuantity("Drip 15mm water");
            r2.setStatus("PENDING");

            return List.of(r1, r2);
        }
        return list;
    }

    public List<Map<String, Object>> getMarketPrices() {
        List<Map<String, Object>> prices = new ArrayList<>();

        Map<String, Object> p1 = new HashMap<>();
        p1.put("commodity", "Wheat (Kalyansona)");
        p1.put("price_per_quintal", 2275);
        p1.put("market", "Ludhiana Mandi");
        p1.put("trend", "UP");
        prices.add(p1);

        Map<String, Object> p2 = new HashMap<>();
        p2.put("commodity", "Paddy (Basmati)");
        p2.put("price_per_quintal", 3850);
        p2.put("market", "Nashik Mandi");
        p2.put("trend", "STABLE");
        prices.add(p2);

        return prices;
    }

    public Map<String, Object> createPestAlert(Map<String, Object> alertData) {
        Map<String, Object> alert = new HashMap<>(alertData);
        alert.put("status", "ALERT_CREATED");
        alert.put("alertId", System.currentTimeMillis());
        alert.put("recordedAt", java.time.LocalDateTime.now().toString());
        if (!alert.containsKey("recommendedAction")) {
            alert.put("recommendedAction", "Apply targeted pesticide/fungicide recommendation within 24 hours");
        }
        return alert;
    }
}
