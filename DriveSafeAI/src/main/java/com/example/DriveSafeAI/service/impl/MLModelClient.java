package com.example.DriveSafeAI.service.impl;



import com.example.DriveSafeAI.entity.TripData;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class MLModelClient {

    private final Random random = new Random();

    // Return a dummy score between 60 and 90
    public Float getDriveScore(TripData trip) {
        return 60 + random.nextFloat() * 30;
    }

    // Return a dummy DRISC score between 50 and 85
    public Float getDriscScore(List<TripData> trips) {
        return 50 + random.nextFloat() * 35;
    }
}

