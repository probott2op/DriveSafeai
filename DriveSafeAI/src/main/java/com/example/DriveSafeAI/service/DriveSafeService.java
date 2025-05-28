package com.example.DriveSafeAI.service;

import com.example.DriveSafeAI.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DriveSafeService {
    UserResponseDTO registerUser(UserRegisterDTO dto);

    String login(LoginRequestDTO dto);


    TripResponseDTO submitTrip(TripRequestDTO dto);

    DriscScoreDTO calculateDriscScore(Long userId);  //updated to use userid

    List<NotificationDTO> getUserNotifications(Long userId);

    String createPolicy(InsurancePolicyDTO dto);

    PremiumCalculationDTO calculatePremium(Long userId);

  String fileClaim(InsuranceClaimDTO dto);

    List<InsuranceClaimDTO> getClaimsByPolicy(Long policyId);


//upload trip csv file
    String uploadTripCsv(MultipartFile file, Long vehicleId);

}
