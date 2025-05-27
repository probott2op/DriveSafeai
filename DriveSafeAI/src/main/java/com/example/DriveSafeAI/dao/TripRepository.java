package com.example.DriveSafeAI.dao;

import com.example.DriveSafeAI.entity.TripData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<TripData, Long> {
    List<TripData> findByVehicleId(Long vehicleId);
}

