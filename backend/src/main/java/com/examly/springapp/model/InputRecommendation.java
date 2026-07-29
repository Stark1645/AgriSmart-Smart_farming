package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "inputrecommendations")
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
    private String status = "PENDING";

    public InputRecommendation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCropSeasonId() { return cropSeasonId; }
    public void setCropSeasonId(Long cropSeasonId) { this.cropSeasonId = cropSeasonId; }

    public String getRecommendationType() { return recommendationType; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }

    public String getRecommendedQuantity() { return recommendedQuantity; }
    public void setRecommendedQuantity(String recommendedQuantity) { this.recommendedQuantity = recommendedQuantity; }

    public LocalDate getRecommendedDate() { return recommendedDate; }
    public void setRecommendedDate(LocalDate recommendedDate) { this.recommendedDate = recommendedDate; }

    public LocalDate getActualAppliedDate() { return actualAppliedDate; }
    public void setActualAppliedDate(LocalDate actualAppliedDate) { this.actualAppliedDate = actualAppliedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
