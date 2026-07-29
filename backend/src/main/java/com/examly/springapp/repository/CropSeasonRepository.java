package com.examly.springapp.repository;

import com.examly.springapp.model.CropSeason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropSeasonRepository extends JpaRepository<CropSeason, Long> {
    List<CropSeason> findByFarmId(Long farmId);
}
