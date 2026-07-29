package com.examly.springapp.controller;

import com.examly.springapp.model.CropSeason;
import com.examly.springapp.service.CropSeasonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Crop Season Controller", description = "Crop season planning, variety selection, and yield tracking")
public class CropSeasonController {

    @Autowired
    private CropSeasonService cropSeasonService;

    @Operation(summary = "Get Crop Season By ID")
    @GetMapping("/crop-seasons/{id}")
    public ResponseEntity<CropSeason> getCropSeasonById(@PathVariable Long id) {
        return ResponseEntity.ok(cropSeasonService.getCropSeasonById(id));
    }

    @Operation(summary = "Get Crop Seasons By Farm ID")
    @GetMapping("/crop-seasons/farm/{farmId}")
    public ResponseEntity<List<CropSeason>> getCropSeasonsByFarmId(@PathVariable Long farmId) {
        return ResponseEntity.ok(cropSeasonService.getCropSeasonsByFarmId(farmId));
    }

    @Operation(summary = "Plan Crop Season (FR4)")
    @PostMapping("/crop-seasons")
    public ResponseEntity<CropSeason> createCropSeason(@RequestBody CropSeason cropSeason) {
        CropSeason created = cropSeasonService.createCropSeason(cropSeason);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
