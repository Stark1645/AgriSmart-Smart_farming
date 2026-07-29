package com.examly.springapp.repository;

import com.examly.springapp.model.InputRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InputRecommendationRepository extends JpaRepository<InputRecommendation, Long> {
    List<InputRecommendation> findByCropSeasonId(Long cropSeasonId);
}
