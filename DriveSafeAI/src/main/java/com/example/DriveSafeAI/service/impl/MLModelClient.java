package com.example.DriveSafeAI.service.impl;



import com.example.DriveSafeAI.entity.TripData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MLModelClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ml.api.url:http://localhost:5000/predict/batch}")
    private String mlApiUrl;

    private final Random random = new Random();
    private final ObjectMapper mapper = new ObjectMapper();
    // Return a dummy score between 60 and 90
    public Float getDriveScore(TripData trip) {
        return 60 + random.nextFloat() * 30;
    }

    // Return a dummy DRISC score between 50 and 85
    public Float getDriscScore(List<TripData> trips) {
        return 50 + random.nextFloat() * 35;
    }

    // ✅ NEW: Returns dummy Drive Score from a full list of TripData points (batch)
   // public Float getDriveScoreFromList(List<TripData> tripDataList) {
        // Simulate scoring based on number of valid data points
     //   if (tripDataList == null || tripDataList.isEmpty()) return 0f;

       // float base = 60 + random.nextFloat() * 30;
        //float noise = (tripDataList.size() > 100) ? 5 : -5;
        //return Math.min(100, Math.max(0, base + noise));


    public Float getDriveScoreFromList(List<TripData> tripDataList) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Convert TripData objects to Map format expected by ML API
            List<Map<String, Object>> requestData = new ArrayList<>();
            for (TripData trip : tripDataList) {
                Map<String, Object> tripMap = new HashMap<>();
                tripMap.put("speed", trip.getSpeed());
                tripMap.put("rpm", trip.getRpm());
                tripMap.put("acceleration", trip.getAcceleration());
                tripMap.put("throttle_position", trip.getThrottlePosition());
                tripMap.put("engine_temperature", trip.getEngineTemperature());
                tripMap.put("system_voltage", trip.getSystemVoltage());
                tripMap.put("engine_load_value", trip.getEngineLoadValue());
                tripMap.put("distance_travelled", trip.getDistanceTravelled());
                tripMap.put("brake", trip.getBrake());
                requestData.add(tripMap);
            }

            String requestJson = mapper.writeValueAsString(requestData);
            HttpEntity<String> request = new HttpEntity<>(requestJson, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(mlApiUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return Float.parseFloat(response.getBody().get("drive_score").toString());
            } else {
                throw new RuntimeException("Flask ML API Error: " + response.getStatusCode());
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to call ML API", e);
        }
    }
    }
