package com.georgejrdev.study_planner.dto.planner;

import java.sql.Date;

import com.georgejrdev.study_planner.common.enums.Level;

public record UpdateTask(
    Long id,
    String name,
    String description,
    Level urgency,
    Level impact,
    Date date,
    Long userID
) {}