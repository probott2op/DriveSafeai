package com.example.DriveSafeAI.service;

import com.example.DriveSafeAI.dto.*;

import java.util.List;

public interface DriveSafeService {
    UserResponseDTO registerUser(UserRegisterDTO dto);

    TripResponseDTO submitTrip(TripRequestDTO dto);

    DriscScoreDTO calculateDriscScore(Long userId);  //updated to use userid

    List<NotificationDTO> getUserNotifications(Long userId);

    String createPolicy(InsurancePolicyDTO dto);

    PremiumCalculationDTO calculatePremium(Long userId);

    String fileClaim(InsuranceClaimDTO dto);

    List<InsuranceClaimDTO> getClaimsByPolicy(Long policyId);
}
