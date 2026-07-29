package com.examly.springapp.controller;

import com.examly.springapp.model.SensorReading;
import com.examly.springapp.service.SensorReadingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "IoT Sensor Telemetry Controller", description = "IoT soil and weather sensor data and real-time monitoring")
public class SensorReadingController {

    @Autowired
    private SensorReadingService sensorReadingService;

    @Operation(summary = "Get Telemetry Readings (FR4/FR8)")
    @GetMapping("/sensor-data/{farmId}")
    public ResponseEntity<List<SensorReading>> getTelemetry(@PathVariable Long farmId) {
        return ResponseEntity.ok(sensorReadingService.getTelemetryByFarmId(farmId));
    }

    @Operation(summary = "Get Live Weather Advisory")
    @GetMapping("/weather/{farmId}")
    public ResponseEntity<Map<String, Object>> getWeather(@PathVariable Long farmId) {
        return ResponseEntity.ok(sensorReadingService.getWeatherAdvisory(farmId));
    }
}
