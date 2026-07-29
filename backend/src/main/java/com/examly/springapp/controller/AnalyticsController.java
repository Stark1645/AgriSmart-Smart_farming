package com.examly.springapp.controller;

import com.examly.springapp.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Analytics & Reports Controller", description = "Smart farming analytics for yield, input cost, and profitability")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Operation(summary = "Get Yield Performance Analytics (FR9)")
    @GetMapping("/analytics/yield/{farmId}")
    public ResponseEntity<Map<String, Object>> getYield(@PathVariable Long farmId) {
        return ResponseEntity.ok(analyticsService.getYieldAnalytics(farmId));
    }

    @Operation(summary = "Get Input Cost Analytics (FR9)")
    @GetMapping("/analytics/input-cost")
    public ResponseEntity<Map<String, Object>> getInputCost() {
        return ResponseEntity.ok(analyticsService.getInputCost());
    }

    @Operation(summary = "Get Profitability Analytics (FR9)")
    @GetMapping("/analytics/profitability")
    public ResponseEntity<Map<String, Object>> getProfitability() {
        return ResponseEntity.ok(analyticsService.getProfitability());
    }

    @Operation(summary = "Get Overall System Statistics")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(analyticsService.getOverallStats());
    }
}
