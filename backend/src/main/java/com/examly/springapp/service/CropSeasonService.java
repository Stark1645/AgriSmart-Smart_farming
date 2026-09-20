package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.CropSeason;
import com.examly.springapp.model.Farm;
import com.examly.springapp.repository.CropSeasonRepository;
import com.examly.springapp.repository.FarmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropSeasonService {

    @Autowired
    private CropSeasonRepository cropSeasonRepository;

    @Autowired
    private FarmRepository farmRepository;

    public List<CropSeason> getAllCropSeasons() {
        return cropSeasonRepository.findAll();
    }

    public CropSeason getCropSeasonById(Long id) {
        return cropSeasonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop Season with ID " + id + " not found"));
    }

    public List<CropSeason> getCropSeasonsByFarmId(Long farmId) {
        return cropSeasonRepository.findByFarmId(farmId);
    }

    public CropSeason createCropSeason(CropSeason cropSeason) {
        if (cropSeason.getFarmId() == null || !farmRepository.existsById(cropSeason.getFarmId())) {
            Farm firstFarm = farmRepository.findAll().stream().findFirst().orElse(null);
            if (firstFarm != null) {
                cropSeason.setFarmId(firstFarm.getId());
            }
        }
        return cropSeasonRepository.save(cropSeason);
    }

    public CropSeason updateCropSeason(Long id, CropSeason updated) {
        CropSeason existing = getCropSeasonById(id);
        if (updated.getCropName() != null && !updated.getCropName().trim().isEmpty()) {
            existing.setCropName(updated.getCropName().trim());
        }
        if (updated.getVariety() != null) {
            existing.setVariety(updated.getVariety().trim());
        }
        if (updated.getSowingDate() != null) {
            existing.setSowingDate(updated.getSowingDate());
        }
        if (updated.getExpectedHarvest() != null) {
            existing.setExpectedHarvest(updated.getExpectedHarvest());
        }
        if (updated.getAreaAcres() != null) {
            existing.setAreaAcres(updated.getAreaAcres());
        }
        if (updated.getStatus() != null && !updated.getStatus().trim().isEmpty()) {
            existing.setStatus(updated.getStatus().trim());
        }
        if (updated.getExpectedYieldKg() != null) {
            existing.setExpectedYieldKg(updated.getExpectedYieldKg());
        }
        if (updated.getActualYieldKg() != null) {
            existing.setActualYieldKg(updated.getActualYieldKg());
        }
        if (updated.getFarmId() != null && farmRepository.existsById(updated.getFarmId())) {
            existing.setFarmId(updated.getFarmId());
        }
        return cropSeasonRepository.save(existing);
    }

    public void deleteCropSeason(Long id) {
        if (!cropSeasonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Crop Season with ID " + id + " not found");
        }
        cropSeasonRepository.deleteById(id);
    }
}
