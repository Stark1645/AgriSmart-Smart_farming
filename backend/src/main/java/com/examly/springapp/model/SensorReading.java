package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensorreadings")
public class SensorReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    @Column(name = "sensor_type", nullable = false, length = 50)
    private String sensorType;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal value;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(name = "alert_triggered")
    private Boolean alertTriggered = false;

    public SensorReading() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getSensorType() { return sensorType; }
    public void setSensorType(String sensorType) { this.sensorType = sensorType; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public Boolean getAlertTriggered() { return alertTriggered; }
    public void setAlertTriggered(Boolean alertTriggered) { this.alertTriggered = alertTriggered; }
}
