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
        // SRS Validation: Name must contain alphabetic characters and spaces only
        if (farm.getFarmName() == null || !farm.getFarmName().trim().matches("^[A-Za-z\\s]+$")) {
            throw new InvalidNameException("Name must not contain numbers or special characters");
        }

        if (farmRepository.existsByFarmName(farm.getFarmName())) {
            throw new DuplicateFarmException("Duplicate unique identifier on farm creation");
        }

        if (farm.getFarmerId() == null) {
            User firstUser = userRepository.findAll().stream().findFirst().orElse(null);
            farm.setFarmerId(firstUser != null ? firstUser.getId() : 1L);
        }

        return farmRepository.save(farm);
    }
}
