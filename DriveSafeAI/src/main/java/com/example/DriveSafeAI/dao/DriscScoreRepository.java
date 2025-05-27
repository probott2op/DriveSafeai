package com.example.DriveSafeAI.dao;

import com.example.DriveSafeAI.entity.DriscScore;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriscScoreRepository extends JpaRepository<DriscScore, Long> {
    List<DriscScore> findByVehicleId(Long vehicleId);
}
