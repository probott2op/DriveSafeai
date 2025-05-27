package com.example.DriveSafeAI.controller;

import com.example.DriveSafeAI.dto.*;
import com.example.DriveSafeAI.service.DriveSafeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DriveSafeController {

    @Autowired
    private DriveSafeService driveSafeService;

    // 1️⃣ Register new user + vehicle
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(driveSafeService.registerUser(dto));
    }

    // 2️⃣ Submit trip data and get DriveScore
    @PostMapping("/trip")
    public ResponseEntity<TripResponseDTO> submitTrip(@RequestBody TripRequestDTO dto) {
        return ResponseEntity.ok(driveSafeService.submitTrip(dto));
    }

    // 3️⃣ Calculate DriscScore (risk score) for user
    @GetMapping("/drisc-score/{userId}")
    public ResponseEntity<DriscScoreDTO> calculateDriscScore(@PathVariable Long userId) {
        return ResponseEntity.ok(driveSafeService.calculateDriscScore(userId));
    }

    // 4️⃣ Get all notifications for user
    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(driveSafeService.getUserNotifications(userId));
    }

    // 5️⃣ Create insurance policy
    @PostMapping("/insurance/policy")
    public ResponseEntity<String> createPolicy(@RequestBody InsurancePolicyDTO dto) {
        return ResponseEntity.ok(driveSafeService.createPolicy(dto));
    }

    // 6️⃣ Calculate premium based on DriscScore and risk category
    @GetMapping("/insurance/premium/{userId}")
    public ResponseEntity<PremiumCalculationDTO> calculatePremium(@PathVariable Long userId) {
        return ResponseEntity.ok(driveSafeService.calculatePremium(userId));
    }

    // 7️⃣ File an insurance claim
    @PostMapping("/insurance/claim")
    public ResponseEntity<String> fileClaim(@RequestBody InsuranceClaimDTO dto) {
        return ResponseEntity.ok(driveSafeService.fileClaim(dto));
    }

    // 8️⃣ Get all claims for a policy
    @GetMapping("/insurance/claim/{policyId}")
    public ResponseEntity<List<InsuranceClaimDTO>> getClaimsByPolicy(@PathVariable Long policyId) {
        return ResponseEntity.ok(driveSafeService.getClaimsByPolicy(policyId));
    }
}
