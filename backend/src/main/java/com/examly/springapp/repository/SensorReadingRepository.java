package com.examly.springapp.repository;

import com.examly.springapp.model.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {
    List<SensorReading> findByFarmIdOrderByRecordedAtDesc(Long farmId);
}
