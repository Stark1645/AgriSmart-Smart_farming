package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "farms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farmer_id", nullable = false)
    private Long farmerId;

    @Column(name = "farm_name", nullable = false, length = 150)
    private String farmName;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(name = "total_area_acres", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalAreaAcres;

    @Column(name = "soil_type", length = 50)
    private String soilType;

    @Column(precision = 9, scale = 6)
    private BigDecimal lat;

    @Column(precision = 9, scale = 6)
    private BigDecimal lng;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}
