package com.examly.springapp.controller;

import com.examly.springapp.model.InputRecommendation;
import com.examly.springapp.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Input Recommendation Controller", description = "Precision irrigation and fertiliser recommendation engine")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Operation(summary = "Get Precision Advisory (FR6)")
    @GetMapping("/recommendations/{seasonId}")
    public ResponseEntity<List<InputRecommendation>> getRecommendations(@PathVariable Long seasonId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsBySeasonId(seasonId));
    }

    @Operation(summary = "Get Mandi Commodity Market Prices")
    @GetMapping("/market-prices")
    public ResponseEntity<List<Map<String, Object>>> getMarketPrices() {
        return ResponseEntity.ok(recommendationService.getMarketPrices());
    }

    @Operation(summary = "Report Pest/Disease Alert (FR4)")
    @PostMapping("/pest-alerts")
    public ResponseEntity<Map<String, Object>> createPestAlert(@RequestBody Map<String, Object> alertDetails) {
        Map<String, Object> alert = recommendationService.createPestAlert(alertDetails);
        return new ResponseEntity<>(alert, org.springframework.http.HttpStatus.CREATED);
    }
}
