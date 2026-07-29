package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.CropSeason;
import com.examly.springapp.repository.CropSeasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropSeasonService {

    @Autowired
    private CropSeasonRepository cropSeasonRepository;

    public CropSeason getCropSeasonById(Long id) {
        return cropSeasonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop Season with ID " + id + " not found"));
    }

    public List<CropSeason> getCropSeasonsByFarmId(Long farmId) {
        return cropSeasonRepository.findByFarmId(farmId);
    }

    public CropSeason createCropSeason(CropSeason cropSeason) {
        return cropSeasonRepository.save(cropSeason);
    }
}
