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
            farm.setFarmName("Smart Green Farm");
        }
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

        if (farmRepository.existsByFarmName(farm.getFarmName())) {
            farm.setFarmName(farm.getFarmName() + " " + (farmRepository.count() + 1));
        }

        return farmRepository.save(farm);
    }
}
