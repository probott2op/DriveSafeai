package com.example.DriveSafeAI.dto;

import java.math.BigDecimal;
import lombok.*;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PremiumCalculationDTO {
    public Long policyId;
    public Float riskScore;
    public String riskCategory;
    public BigDecimal basePremium;
    public Float riskMultiplier;
    public BigDecimal finalPremium;
}
