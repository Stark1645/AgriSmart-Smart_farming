package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "farms")
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
    private String status = "ACTIVE";

    public Farm() {}

    public Farm(Long farmerId, String farmName, String district, BigDecimal totalAreaAcres, String soilType, BigDecimal lat, BigDecimal lng, String status) {
        this.farmerId = farmerId;
        this.farmName = farmName;
        this.district = district;
        this.totalAreaAcres = totalAreaAcres;
        this.soilType = soilType;
        this.lat = lat;
        this.lng = lng;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getFarmName() { return farmName; }
    public void setFarmName(String farmName) { this.farmName = farmName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public BigDecimal getTotalAreaAcres() { return totalAreaAcres; }
    public void setTotalAreaAcres(BigDecimal totalAreaAcres) { this.totalAreaAcres = totalAreaAcres; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public BigDecimal getLat() { return lat; }
    public void setLat(BigDecimal lat) { this.lat = lat; }

    public BigDecimal getLng() { return lng; }
    public void setLng(BigDecimal lng) { this.lng = lng; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
