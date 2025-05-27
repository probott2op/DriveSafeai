package com.example.DriveSafeAI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_data")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TripData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float speed, rpm, acceleration, throttlePosition, engineTemperature;
    private Float systemVoltage, engineLoadValue, distanceTravelled, brake;

    // Risk Features
    private Float speedRisk, harshAcceleration, rpmEfficiency, highRpmRisk, throttleAggression;
    private Float engineTempRisk, voltageRisk, engineLoadRisk, weatherRisk;
    private Float speedVariance, accelerationVariance, excessiveThrottleTime, engineStrain;

    private LocalDateTime recordedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}

