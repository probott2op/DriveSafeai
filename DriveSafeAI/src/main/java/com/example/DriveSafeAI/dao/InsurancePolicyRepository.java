package com.example.DriveSafeAI.dao;

import com.example.DriveSafeAI.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
}


