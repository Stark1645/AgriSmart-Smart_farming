package com.examly.springapp.repository;

import com.examly.springapp.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmRepository extends JpaRepository<Farm, Long> {
    Optional<Farm> findByFarmName(String farmName);
    boolean existsByFarmName(String farmName);
}
