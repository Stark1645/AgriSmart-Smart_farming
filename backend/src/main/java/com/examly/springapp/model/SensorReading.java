package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sensorreadings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(name = "alert_triggered")
    @Builder.Default
    private Boolean alertTriggered = false;
}
