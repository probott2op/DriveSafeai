package com.example.DriveSafeAI.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LiveTripDTO {
    public Long vehicleId;
    public String sessionId;
    public Float speed;
    public Float rpm;
    public Float acceleration;
    public Float throttlePosition;
    public Float engineTemperature;
    public Float systemVoltage;
    public Float distanceTravelled;
    public Float engineLoadValue;
    public Float brake;
}
