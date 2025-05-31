package com.example.DriveSafeAI.service.impl;

import com.example.DriveSafeAI.dto.MLFeedbackResponse;
import com.example.DriveSafeAI.dto.MLPredictionResponse;
import com.example.DriveSafeAI.entity.TripData;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Client for communicating with the Driver Risk Analysis ML API
 * Handles both JSON data and CSV file uploads for predictions
 */
@Component
public class MLModelClient {

    private static final Logger logger = LoggerFactory.getLogger(MLModelClient.class);

    @Value("${ml.api.base-url:http://localhost:5000}")
    private String mlApiBaseUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public MLModelClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Health check for the ML API
     */

    /**
     * Predict drive score using JSON data (single record)
     */
    public MLPredictionResponse predictDriveScore(Map<String, Object> driverData) {
        try {
            String url = mlApiBaseUrl + "/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(driverData, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(
                    url, request, MLPredictionResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Single prediction successful for driver data");
                return response.getBody();
            } else {
                logger.error("Prediction failed with status: {}", response.getStatusCode());
                return MLPredictionResponse.error("Prediction failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error during single prediction", e);
            return MLPredictionResponse.error("Prediction error: " + e.getMessage());
        }
    }

    /**
     * Predict drive score using JSON data (multiple records)
     */
    public MLPredictionResponse predictDriveScore(List<Map<String, Object>> driverDataList) {
        try {
            String url = mlApiBaseUrl + "/predict";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(driverDataList, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(
                    url, request, MLPredictionResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Batch prediction successful for {} records", driverDataList.size());
                return response.getBody();
            } else {
                logger.error("Batch prediction failed with status: {}", response.getStatusCode());
                return MLPredictionResponse.error("Batch prediction failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error during batch prediction", e);
            return MLPredictionResponse.error("Batch prediction error: " + e.getMessage());
        }
    }

    /**
     * Predict drive score using CSV file upload
     */
    public MLPredictionResponse predictDriveScoreFromCsv(MultipartFile csvFile) {
        try {
            String url = mlApiBaseUrl + "/predict";

            // Create multipart request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(csvFile.getBytes()) {
                @Override
                public String getFilename() {
                    return csvFile.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(
                    url, request, MLPredictionResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("CSV prediction successful for file: {}", csvFile.getOriginalFilename());
                return response.getBody();
            } else {
                logger.error("CSV prediction failed with status: {}", response.getStatusCode());
                return MLPredictionResponse.error("CSV prediction failed with status: " + response.getStatusCode());
            }

        } catch (IOException e) {
            logger.error("Error reading CSV file", e);
            return MLPredictionResponse.error("Error reading CSV file: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error during CSV prediction", e);
            return MLPredictionResponse.error("CSV prediction error: " + e.getMessage());
        }
    }

    /**
     * Get predictions with AI feedback
     */
    public MLFeedbackResponse predictWithFeedback(List<Map<String, Object>> driverDataList) {
        try {
            String url = mlApiBaseUrl + "/predict_with_feedback";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(driverDataList, headers);

            ResponseEntity<MLFeedbackResponse> response = restTemplate.postForEntity(
                    url, request, MLFeedbackResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("Prediction with feedback successful for {} records", driverDataList.size());
                return response.getBody();
            } else {
                logger.error("Prediction with feedback failed with status: {}", response.getStatusCode());
                return MLFeedbackResponse.error("Prediction with feedback failed: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error during prediction with feedback", e);
            return MLFeedbackResponse.error("Prediction with feedback error: " + e.getMessage());
        }
    }

    /**
     * Get predictions with AI feedback from CSV file
     */
    public MLFeedbackResponse predictWithFeedbackFromCsv(MultipartFile csvFile) {
        try {
            String url = mlApiBaseUrl + "/predict_with_feedback";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(csvFile.getBytes()) {
                @Override
                public String getFilename() {
                    return csvFile.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<MLFeedbackResponse> response = restTemplate.postForEntity(
                    url, request, MLFeedbackResponse.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                logger.info("CSV prediction with feedback successful for file: {}", csvFile.getOriginalFilename());
                return response.getBody();
            } else {
                logger.error("CSV prediction with feedback failed with status: {}", response.getStatusCode());
                return MLFeedbackResponse.error("CSV prediction with feedback failed: " + response.getStatusCode());
            }

        } catch (IOException e) {
            logger.error("Error reading CSV file for feedback", e);
            return MLFeedbackResponse.error("Error reading CSV file: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error during CSV prediction with feedback", e);
            return MLFeedbackResponse.error("CSV prediction with feedback error: " + e.getMessage());
        }
    }

    /**
     * Get model information
     */

    public Float getDriveScoreFromList(List<TripData> tripDataList) {
        try {
            String url = mlApiBaseUrl + "/predict_batch";

            // Convert TripData list to a list of maps
            List<Map<String, Object>> driverDataList = tripDataList.stream().map(trip -> {
                Map<String, Object> data = Map.of(
                        "speed", trip.getSpeed(),
                        "rpm", trip.getRpm(),
                        "acceleration", trip.getAcceleration(),
                        "throttle_position", trip.getThrottlePosition(),
                        "engine_temperature", trip.getEngineTemperature(),
                        "system_voltage", trip.getSystemVoltage(),
                        "engine_load_value", trip.getEngineLoadValue(),
                        "distance_travelled", trip.getDistanceTravelled(),
                        "brake", trip.getBrake()
                );
                return data;
            }).collect(Collectors.toList());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(driverDataList, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.postForEntity(
                    url, request, MLPredictionResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                logger.info("Batch prediction successful for {} records", tripDataList.size());
                return response.getBody().getDriveScore().floatValue();
            } else {
                logger.error("Batch prediction failed with status: {}", response.getStatusCode());
                throw new RuntimeException("Batch prediction failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Error during batch prediction", e);
            throw new RuntimeException("Batch prediction error: " + e.getMessage());
        }

    }

    }

    // Response DTOs

   /* @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MLPredictionResponse {
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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static  class MLFeedbackResponse {
        private List<Map<String, Object>> aiFeedback;
        private List<Map<String, Object>> tripSummaries;
        private Map<String, Object> overallSummary;
        private String processedAt;
        private String error;

        public static MLFeedbackResponse error(String error) {
            return MLFeedbackResponse.builder()
                    .error(error)
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MLModelInfoResponse {
        private String modelStatus;
        private int trainingFeaturesCount;
        private Map<String, Object> riskThresholds;
        private List<Map<String, Object>> topFeatures;
        private Map<String, Object> modelParams;
        private boolean openaiConfigured;
        private String error;

        public static MLModelInfoResponse error(String error) {
            return MLModelInfoResponse.builder()
                    .error(error)
                    .build();
        }*/

