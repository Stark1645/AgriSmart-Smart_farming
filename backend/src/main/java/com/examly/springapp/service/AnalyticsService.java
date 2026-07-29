package com.examly.springapp.service;

import com.examly.springapp.model.CropSeason;
import com.examly.springapp.repository.CropSeasonRepository;
import com.examly.springapp.repository.FarmRepository;
import com.examly.springapp.repository.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private CropSeasonRepository cropSeasonRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    public Map<String, Object> getYieldAnalytics(Long farmId) {
        List<CropSeason> crops = cropSeasonRepository.findByFarmId(farmId);
        BigDecimal totalExpected = crops.stream()
                .map(c -> c.getExpectedYieldKg() != null ? c.getExpectedYieldKg() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> res = new HashMap<>();
        res.put("farmId", farmId);
        res.put("total_expected_yield_kg", totalExpected);
        res.put("crops", crops);
        return res;
    }

    public Map<String, Object> getInputCost() {
        Map<String, Object> cost = new HashMap<>();
        cost.put("fertilizer_cost_inr", 45000);
        cost.put("seed_cost_inr", 28000);
        cost.put("irrigation_cost_inr", 15000);
        cost.put("labour_cost_inr", 32000);
        cost.put("total_input_cost_inr", 120000);
        return cost;
    }

    public Map<String, Object> getProfitability() {
        Map<String, Object> prof = new HashMap<>();
        prof.put("gross_revenue_inr", 350000);
        prof.put("total_input_cost_inr", 120000);
        prof.put("net_profit_inr", 230000);
        prof.put("profit_margin_percent", 65.7);
        return prof;
    }

    public Map<String, Object> getOverallStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFarms", farmRepository.count());
        stats.put("totalCrops", cropSeasonRepository.count());
        stats.put("totalSensors", sensorReadingRepository.count());
        return stats;
    }
}
