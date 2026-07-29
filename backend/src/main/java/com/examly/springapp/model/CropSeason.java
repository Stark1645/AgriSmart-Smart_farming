package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cropseasons")
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
    private String status = "GROWING";

    @Column(name = "expected_yield_kg", precision = 10, scale = 2)
    private BigDecimal expectedYieldKg;

    @Column(name = "actual_yield_kg", precision = 10, scale = 2)
    private BigDecimal actualYieldKg;

    public CropSeason() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmId() { return farmId; }
    public void setFarmId(Long farmId) { this.farmId = farmId; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getVariety() { return variety; }
    public void setVariety(String variety) { this.variety = variety; }

    public LocalDate getSowingDate() { return sowingDate; }
    public void setSowingDate(LocalDate sowingDate) { this.sowingDate = sowingDate; }

    public LocalDate getExpectedHarvest() { return expectedHarvest; }
    public void setExpectedHarvest(LocalDate expectedHarvest) { this.expectedHarvest = expectedHarvest; }

    public BigDecimal getAreaAcres() { return areaAcres; }
    public void setAreaAcres(BigDecimal areaAcres) { this.areaAcres = areaAcres; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getExpectedYieldKg() { return expectedYieldKg; }
    public void setExpectedYieldKg(BigDecimal expectedYieldKg) { this.expectedYieldKg = expectedYieldKg; }

    public BigDecimal getActualYieldKg() { return actualYieldKg; }
    public void setActualYieldKg(BigDecimal actualYieldKg) { this.actualYieldKg = actualYieldKg; }
}
