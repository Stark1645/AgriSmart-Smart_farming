package com.examly.springapp.controller;

import com.examly.springapp.model.Farm;
import com.examly.springapp.service.FarmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Farm Management Controller", description = "Farm registration, GIS mapping, and farm lifecycle management")
public class FarmController {

    @Autowired
    private FarmService farmService;

    @Operation(summary = "Get All Farms (FR4)")
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmService.getAllFarms());
    }

    @Operation(summary = "Get Farm By ID")
    @GetMapping("/farms/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable Long id) {
        return ResponseEntity.ok(farmService.getFarmById(id));
    }

    @Operation(summary = "Register New Farm (FR4)")
    @PostMapping("/farms")
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        Farm created = farmService.createFarm(farm);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
