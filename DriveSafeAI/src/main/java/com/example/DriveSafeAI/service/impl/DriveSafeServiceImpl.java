package com.example.DriveSafeAI.service.impl;

import com.example.DriveSafeAI.dao.*;
import com.example.DriveSafeAI.dto.*;
import com.example.DriveSafeAI.entity.*;
import com.example.DriveSafeAI.enums.*;
import com.example.DriveSafeAI.service.DriveSafeService;
import com.example.DriveSafeAI.service.MLModelClient;
import com.example.DriveSafeAI.service.security.JWTService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DriveSafeServiceImpl implements DriveSafeService {

    @Autowired private UserRepository userRepo;
    @Autowired private VehicleRepository vehicleRepo;
    @Autowired private TripRepository tripRepo;
    @Autowired private DriveScoreRepository driveScoreRepo;
    @Autowired private DriscScoreRepository driscScoreRepository;
    @Autowired private NotificationRepository notificationRepo;
    @Autowired private InsurancePolicyRepository policyRepo;
    @Autowired private PremiumCalculationRepository premiumRepo;
    @Autowired private RiskCategoryRepository riskCategoryRepo;
    @Autowired private InsuranceClaimRepository claimRepo;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JWTService jwtService;
    @Autowired private MLModelClient mlClient;

    //User Registration
    @Override
    public UserResponseDTO registerUser(UserRegisterDTO dto) {
        User user = new User();
        user.setFullName(dto.fullName);
        user.setEmail(dto.email);
        user.setDrivingLicense(dto.drivingLicense);
        final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        user.setPassword(encoder.encode(dto.password));
        userRepo.save(user);

        Vehicle vehicle = new Vehicle();
        vehicle.setChasisNo(dto.chasisNo);
        vehicle.setVehicleNo(dto.vehicleNo);
        vehicle.setModel(dto.model);
        vehicle.setManufacturer(dto.manufacturer);
        vehicle.setUser(user);

        vehicleRepo.save(vehicle);

        return new UserResponseDTO(user.getId(), user.getEmail(), vehicle.getVehicleNo());
    }

//    //User Login
//    @Override
//    public UserResponseDTO login(LoginRequestDTO dto) {
//        User user = userRepo.findByEmailAndPassword(dto.email, dto.password)
//                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
//
//        Vehicle vehicle = vehicleRepo.findByUserId(user.getId())
//                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
//
//        return new UserResponseDTO(user.getId(), user.getEmail(), vehicle.getVehicleNo());
//    }

    @Override
    public String login(LoginRequestDTO loginRequestDTO) {
        User user = userRepo.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(loginRequestDTO.getEmail(), null, user.getId());
        }
        throw new RuntimeException("Invalid credentials");
    }


    //Trip Submission and DriveScore Generation
    @Override
    public TripResponseDTO submitTrip(TripRequestDTO dto) {
        TripData trip = new TripData();
        trip.setSpeed(dto.speed);
        trip.setRpm(dto.rpm);
        trip.setAcceleration(dto.acceleration);
        trip.setThrottlePosition(dto.throttlePosition);
        trip.setEngineTemperature(dto.engineTemperature);
        trip.setSystemVoltage(dto.systemVoltage);
        trip.setEngineLoadValue(dto.engineLoadValue);
        trip.setDistanceTravelled(dto.distanceTravelled);
        trip.setBrake(dto.brake);

        Vehicle vehicle = vehicleRepo.findById(dto.vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        trip.setVehicle(vehicle);

        tripRepo.save(trip);

        Float driveScore = mlClient.getDriveScore(trip);

        DriveScore score = new DriveScore();
        score.setScore(driveScore);
        score.setTripData(trip);
        score.setVehicle(vehicle);
        driveScoreRepo.save(score);

        Notification n = new Notification();
        n.setUser(vehicle.getUser());
        n.setMessage("Your Drive Score: " + driveScore);
        notificationRepo.save(n);

        return new TripResponseDTO(trip.getId(), driveScore,
                driveScore > 80 ? "Excellent driving!" : "Improve your braking or acceleration.");
    }

    // DriscScore Calculation
    @Override
    public DriscScoreDTO calculateDriscScore(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found for user"));

        List<DriveScore> last10 = driveScoreRepo.findTop10ByVehicleIdOrderByCreatedAtDesc(vehicle.getId());

        if (last10.isEmpty()) {
            throw new RuntimeException("Not enough trip data to calculate DRISC Score.");
        }

        Float driscScore = mlClient.getRiskScore(last10);

        DriscScore score = new DriscScore();
        score.setScore(driscScore);
        score.setUserid(user);
        score.setTripsConsidered(last10.size());
        driscScoreRepository.save(score);

        Notification n = new Notification();
        n.setUser(user);
        n.setMessage("DRISC Score updated: " + driscScore);
        notificationRepo.save(n);

        return new DriscScoreDTO(driscScore, last10.size());
    }

    //Get Notifications
    @Override
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepo.findByUserId(userId).stream()
                .map(n -> new NotificationDTO(n.getMessage(), n.getIsRead(), n.getCreatedAt()))
                .collect(Collectors.toList());
    }

    //Create Insurance Policy
    @Override
    public String createPolicy(InsurancePolicyDTO dto) {
        InsurancePolicy policy = new InsurancePolicy();
        policy.setPolicyNumber(dto.policyNumber);
        policy.setUser(userRepo.findById(dto.userId).orElseThrow());
        policy.setVehicle(vehicleRepo.findById(dto.vehicleId).orElseThrow());
        policy.setPolicyStartDate(dto.policyStartDate);
        policy.setPolicyEndDate(dto.policyEndDate);
        policy.setCoverageType(dto.coverageType);
        policy.setCoverageAmount(dto.coverageAmount);
        policy.setBasePremium(dto.basePremium);
        policy.setCurrentPremium(dto.basePremium);
        policy.setStatus(PolicyStatus.PENDING);

        policyRepo.save(policy);
        return "Policy created with number: " + policy.getPolicyNumber();
    }

    // 6️⃣ Calculate Premium based on DriscScore + Risk Category
    @Override
    public PremiumCalculationDTO calculatePremium(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        Vehicle vehicle = vehicleRepo.findByUserId(userId).orElseThrow();
        InsurancePolicy policy = policyRepo.findByVehicleId(vehicle.getId()).orElseThrow();

        DriscScore latest = driscScoreRepository.findTopByUseridOrderByCalculatedAtDesc(user)
                .orElseThrow(() -> new RuntimeException("No DriscScore found"));

        RiskCategory category = riskCategoryRepo.findByMinScoreLessThanEqualAndMaxScoreGreaterThanEqual(
                latest.getScore(), latest.getScore()).orElseThrow();

        BigDecimal calculated = policy.getBasePremium()
                .multiply(BigDecimal.valueOf(category.getPremiumMultiplier()));

        PremiumCalculation pc = new PremiumCalculation();
        pc.setPolicy(policy);
        pc.setDriscScore(latest);
        pc.setRiskCategory(category);
        pc.setBasePremium(policy.getBasePremium());
        pc.setRiskMultiplier(category.getPremiumMultiplier());
        pc.setCalculatedPremium(calculated);
        pc.setPeriodStart(LocalDate.now());
        pc.setPeriodEnd(LocalDate.now().plusMonths(12));
        pc.setIsActive(true);
        premiumRepo.save(pc);

        policy.setCurrentPremium(calculated);
        policy.setStatus(PolicyStatus.ACTIVE);
        policyRepo.save(policy);

        return new PremiumCalculationDTO(policy.getId(), latest.getScore(), category.getCategoryName(),
                policy.getBasePremium(), category.getPremiumMultiplier(), calculated);
    }

    // 7️⃣ File Insurance Claim
    @Override
    public String fileClaim(InsuranceClaimDTO dto) {
        InsurancePolicy policy = policyRepo.findById(dto.policyId).orElseThrow();

        InsuranceClaim claim = new InsuranceClaim();
        claim.setPolicy(policy);
        claim.setClaimNumber(dto.claimNumber);
        claim.setClaimDate(dto.claimDate);
        claim.setIncidentDate(dto.incidentDate);
        claim.setClaimAmount(dto.claimAmount);
        claim.setDescription(dto.description);
        claim.setClaimStatus(ClaimStatus.SUBMITTED);

        claimRepo.save(claim);
        return "Claim filed successfully with number: " + claim.getClaimNumber();
    }

    // 8️⃣ Get All Claims by Policy
    @Override
    public List<InsuranceClaimDTO> getClaimsByPolicy(Long policyId) {
        return claimRepo.findByPolicyId(policyId).stream()
                .map(claim -> new InsuranceClaimDTO(
                        claim.getPolicy().getId(),
                        claim.getClaimNumber(),
                        claim.getClaimDate(),
                        claim.getIncidentDate(),
                        claim.getClaimAmount(),
                        claim.getDescription()))
                .collect(Collectors.toList());
    }


    // Upload Trip CSV File


    @Override
    public String uploadTripCsv(MultipartFile file, Long vehicleId) {
        Vehicle vehicle = vehicleRepo.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        List<TripData> trips = new ArrayList<>();

        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT
                     .withFirstRecordAsHeader()
                     .withIgnoreHeaderCase()
                     .withTrim())) {

            for (CSVRecord record : parser) {
                TripData trip = new TripData();
                trip.setSpeed(Float.parseFloat(record.get("speed")));
                trip.setRpm(Float.parseFloat(record.get("rpm")));
                trip.setAcceleration(Float.parseFloat(record.get("acceleration")));
                trip.setThrottlePosition(Float.parseFloat(record.get("throttle_position")));
                trip.setEngineTemperature(Float.parseFloat(record.get("engine_temperature")));
                trip.setSystemVoltage(Float.parseFloat(record.get("system_voltage")));
                trip.setEngineLoadValue(Float.parseFloat(record.get("engine_load_value")));
                trip.setDistanceTravelled(Float.parseFloat(record.get("distance_travelled")));
                trip.setBrake(Float.parseFloat(record.get("brake")));
                trip.setVehicle(vehicle);
                trips.add(trip);
            }

            tripRepo.saveAll(trips); // ✅ Batch save
            return "Uploaded " + trips.size() + " trips successfully.";

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage());
        }
    }

}
