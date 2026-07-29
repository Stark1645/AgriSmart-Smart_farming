package com.examly.springapp.service;

import com.examly.springapp.model.SensorReading;
import com.examly.springapp.repository.SensorReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SensorReadingService {

    @Autowired
    private SensorReadingRepository sensorReadingRepository;

    public List<SensorReading> getTelemetryByFarmId(Long farmId) {
        return sensorReadingRepository.findByFarmIdOrderByRecordedAtDesc(farmId);
    }

    public Map<String, Object> getWeatherAdvisory(Long farmId) {
        Map<String, Object> weather = new HashMap<>();
        weather.put("farmId", farmId);
        weather.put("temperature", 29.4);
        weather.put("humidity", 74);
        weather.put("rainfall_mm", 12.5);
        weather.put("forecast", "Light rain expected tomorrow evening");
        weather.put("condition", "Partly Cloudy");
        return weather;
    }
}
