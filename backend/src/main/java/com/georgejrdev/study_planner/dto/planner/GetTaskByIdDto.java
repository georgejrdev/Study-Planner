package com.georgejrdev.study_planner.dto.planner;

public record GetTaskByIdDto(
    Long id,
    Long userID
) {}