package com.example.DriveSafeAI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public  class MLPredictionResponse {
    private Double driveScore;
    private Double riskScore;
    private String riskCategory;
    private String inputMethod;
    private Map<String, Object> prediction;
    private String error;

    public static MLPredictionResponse error(String error) {
        return MLPredictionResponse.builder()
                .error(error)
                .build();
    }
}
