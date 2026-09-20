package com.examly.springapp.service;

import com.examly.springapp.exception.DuplicateFarmException;
import com.examly.springapp.exception.InvalidNameException;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Farm;
import com.examly.springapp.repository.FarmRepository;
import com.examly.springapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FarmServiceTest {

    @Mock
    private FarmRepository farmRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FarmService farmService;

    private Farm mockFarm;

    @BeforeEach
    void setUp() {
        mockFarm = new Farm();
        mockFarm.setId(1L);
        mockFarm.setFarmName("Green Valley Farm");
        mockFarm.setDistrict("Ludhiana");
        mockFarm.setTotalAreaAcres(new BigDecimal("45.5"));
        mockFarm.setSoilType("Loamy");
        mockFarm.setFarmerId(10L);
        mockFarm.setStatus("ACTIVE");
    }

    @Test
    void testGetAllFarms() {
        when(farmRepository.findAll()).thenReturn(List.of(mockFarm));
        List<Farm> farms = farmService.getAllFarms();
        assertEquals(1, farms.size());
        assertEquals("Green Valley Farm", farms.get(0).getFarmName());
    }

    @Test
    void testGetFarmByIdFound() {
        when(farmRepository.findById(1L)).thenReturn(Optional.of(mockFarm));
        Farm found = farmService.getFarmById(1L);
        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void testGetFarmByIdNotFoundThrowsException() {
        when(farmRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> farmService.getFarmById(99L));
    }

    @Test
    void testCreateFarmSuccess() {
        when(farmRepository.existsByFarmName("Green Valley Farm")).thenReturn(false);
        when(farmRepository.save(any(Farm.class))).thenAnswer(i -> i.getArgument(0));

        Farm created = farmService.createFarm(mockFarm);
        assertNotNull(created);
        assertEquals("Green Valley Farm", created.getFarmName());
    }

    @Test
    void testCreateFarmEmptyNameThrowsException() {
        Farm invalid = new Farm();
        invalid.setFarmName("");
        assertThrows(InvalidNameException.class, () -> farmService.createFarm(invalid));
    }

    @Test
    void testCreateFarmDuplicateNameThrowsException() {
        when(farmRepository.existsByFarmName("Green Valley Farm")).thenReturn(true);
        assertThrows(DuplicateFarmException.class, () -> farmService.createFarm(mockFarm));
    }

    @Test
    void testUpdateFarmSuccess() {
        when(farmRepository.findById(1L)).thenReturn(Optional.of(mockFarm));
        when(farmRepository.save(any(Farm.class))).thenAnswer(i -> i.getArgument(0));

        Farm updatePayload = new Farm();
        updatePayload.setDistrict("Amritsar");
        updatePayload.setStatus("INACTIVE");

        Farm updated = farmService.updateFarm(1L, updatePayload);
        assertEquals("Amritsar", updated.getDistrict());
        assertEquals("INACTIVE", updated.getStatus());
        assertEquals("Green Valley Farm", updated.getFarmName());
    }

    @Test
    void testDeleteFarmSuccess() {
        when(farmRepository.existsById(1L)).thenReturn(true);
        doNothing().when(farmRepository).deleteById(1L);

        assertDoesNotThrow(() -> farmService.deleteFarm(1L));
        verify(farmRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteFarmNotFoundThrowsException() {
        when(farmRepository.existsById(99L)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> farmService.deleteFarm(99L));
    }
}
