package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "inputrecommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_season_id", nullable = false)
    private Long cropSeasonId;

    @Column(name = "recommendation_type", nullable = false, length = 50)
    private String recommendationType;

    @Column(name = "recommended_quantity", nullable = false, length = 100)
    private String recommendedQuantity;

    @Column(name = "recommended_date", nullable = false)
    private LocalDate recommendedDate;

    @Column(name = "actual_applied_date")
    private LocalDate actualAppliedDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING";
}
