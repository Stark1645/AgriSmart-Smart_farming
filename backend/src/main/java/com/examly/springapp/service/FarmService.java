package com.examly.springapp.service;

import com.examly.springapp.exception.DuplicateFarmException;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Farm;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.FarmRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm with ID " + id + " not found"));
    }

    public Farm createFarm(Farm farm) {
        if (farm.getFarmName() == null || farm.getFarmName().trim().isEmpty()) {
            throw new InvalidNameException("Farm name cannot be empty");
        }
        if (farmRepository.existsByFarmName(farm.getFarmName().trim())) {
            throw new DuplicateFarmException("Farm with name '" + farm.getFarmName().trim() + "' already exists");
        }
        farm.setFarmName(farm.getFarmName().trim());

        if (farm.getDistrict() == null || farm.getDistrict().trim().isEmpty()) {
            farm.setDistrict("Ludhiana");
        }
        if (farm.getTotalAreaAcres() == null) {
            farm.setTotalAreaAcres(new java.math.BigDecimal("10.0"));
        }
        if (farm.getSoilType() == null || farm.getSoilType().trim().isEmpty()) {
            farm.setSoilType("Loamy");
        }
        if (farm.getFarmerId() == null) {
            User firstUser = userRepository.findAll().stream().findFirst().orElse(null);
            farm.setFarmerId(firstUser != null ? firstUser.getId() : 1L);
        }

        return farmRepository.save(farm);
    }

    public Farm updateFarm(Long id, Farm updated) {
        Farm existing = getFarmById(id);
        if (updated.getFarmName() != null && !updated.getFarmName().trim().isEmpty()) {
            String newName = updated.getFarmName().trim();
            if (!newName.equalsIgnoreCase(existing.getFarmName()) && farmRepository.existsByFarmName(newName)) {
                throw new DuplicateFarmException("Farm with name '" + newName + "' already exists");
            }
            existing.setFarmName(newName);
        }
        if (updated.getDistrict() != null && !updated.getDistrict().trim().isEmpty()) {
            existing.setDistrict(updated.getDistrict().trim());
        }
        if (updated.getTotalAreaAcres() != null) {
            existing.setTotalAreaAcres(updated.getTotalAreaAcres());
        }
        if (updated.getSoilType() != null && !updated.getSoilType().trim().isEmpty()) {
            existing.setSoilType(updated.getSoilType().trim());
        }
        if (updated.getLat() != null) {
            existing.setLat(updated.getLat());
        }
        if (updated.getLng() != null) {
            existing.setLng(updated.getLng());
        }
        if (updated.getStatus() != null && !updated.getStatus().trim().isEmpty()) {
            existing.setStatus(updated.getStatus().trim());
        }
        return farmRepository.save(existing);
    }

    public void deleteFarm(Long id) {
        if (!farmRepository.existsById(id)) {
            throw new ResourceNotFoundException("Farm with ID " + id + " not found");
        }
        farmRepository.deleteById(id);
    }
}
