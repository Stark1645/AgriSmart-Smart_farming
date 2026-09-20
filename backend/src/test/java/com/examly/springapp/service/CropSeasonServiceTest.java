package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.CropSeason;
import com.examly.springapp.repository.CropSeasonRepository;
import com.examly.springapp.repository.FarmRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CropSeasonServiceTest {

    @Mock
    private CropSeasonRepository cropSeasonRepository;

    @Mock
    private FarmRepository farmRepository;

    @InjectMocks
    private CropSeasonService cropSeasonService;

    private CropSeason mockCrop;

    @BeforeEach
    void setUp() {
        mockCrop = new CropSeason();
        mockCrop.setId(1L);
        mockCrop.setFarmId(2L);
        mockCrop.setCropName("Wheat");
        mockCrop.setVariety("Kalyansona");
        mockCrop.setSowingDate(LocalDate.of(2026, 5, 1));
        mockCrop.setExpectedHarvest(LocalDate.of(2026, 8, 15));
        mockCrop.setAreaAcres(new BigDecimal("18.0"));
        mockCrop.setStatus("GROWING");
        mockCrop.setExpectedYieldKg(new BigDecimal("4200.0"));
    }

    @Test
    void testGetAllCropSeasons() {
        when(cropSeasonRepository.findAll()).thenReturn(List.of(mockCrop));
        List<CropSeason> seasons = cropSeasonService.getAllCropSeasons();
        assertEquals(1, seasons.size());
        assertEquals("Wheat", seasons.get(0).getCropName());
    }

    @Test
    void testGetCropSeasonByIdFound() {
        when(cropSeasonRepository.findById(1L)).thenReturn(Optional.of(mockCrop));
        CropSeason found = cropSeasonService.getCropSeasonById(1L);
        assertNotNull(found);
        assertEquals("Wheat", found.getCropName());
    }

    @Test
    void testGetCropSeasonByIdNotFoundThrowsException() {
        when(cropSeasonRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> cropSeasonService.getCropSeasonById(99L));
    }

    @Test
    void testGetCropSeasonsByFarmId() {
        when(cropSeasonRepository.findByFarmId(2L)).thenReturn(List.of(mockCrop));
        List<CropSeason> farmCrops = cropSeasonService.getCropSeasonsByFarmId(2L);
        assertEquals(1, farmCrops.size());
        assertEquals(2L, farmCrops.get(0).getFarmId());
    }

    @Test
    void testCreateCropSeason() {
        when(farmRepository.existsById(2L)).thenReturn(true);
        when(cropSeasonRepository.save(any(CropSeason.class))).thenAnswer(i -> i.getArgument(0));

        CropSeason created = cropSeasonService.createCropSeason(mockCrop);
        assertNotNull(created);
        assertEquals("Wheat", created.getCropName());
    }

    @Test
    void testUpdateCropSeasonSuccess() {
        when(cropSeasonRepository.findById(1L)).thenReturn(Optional.of(mockCrop));
        when(cropSeasonRepository.save(any(CropSeason.class))).thenAnswer(i -> i.getArgument(0));

        CropSeason updatePayload = new CropSeason();
        updatePayload.setStatus("HARVESTED");
        updatePayload.setActualYieldKg(new BigDecimal("4500.0"));

        CropSeason updated = cropSeasonService.updateCropSeason(1L, updatePayload);
        assertEquals("HARVESTED", updated.getStatus());
        assertEquals(new BigDecimal("4500.0"), updated.getActualYieldKg());
    }

    @Test
    void testDeleteCropSeasonSuccess() {
        when(cropSeasonRepository.existsById(1L)).thenReturn(true);
        doNothing().when(cropSeasonRepository).deleteById(1L);

        assertDoesNotThrow(() -> cropSeasonService.deleteCropSeason(1L));
        verify(cropSeasonRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteCropSeasonNotFoundThrowsException() {
        when(cropSeasonRepository.existsById(99L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> cropSeasonService.deleteCropSeason(99L));
    }
}
