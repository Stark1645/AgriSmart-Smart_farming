package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cropseasons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropSeason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id", nullable = false)
    private Long farmId;

    @Column(name = "crop_name", nullable = false, length = 100)
    private String cropName;

    @Column(length = 100)
    private String variety;

    @Column(name = "sowing_date", nullable = false)
    private LocalDate sowingDate;

    @Column(name = "expected_harvest")
    private LocalDate expectedHarvest;

    @Column(name = "area_acres", nullable = false, precision = 8, scale = 2)
    private BigDecimal areaAcres;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "GROWING";

    @Column(name = "expected_yield_kg", precision = 10, scale = 2)
    private BigDecimal expectedYieldKg;

    @Column(name = "actual_yield_kg", precision = 10, scale = 2)
    private BigDecimal actualYieldKg;
}
