package com.georgejrdev.study_planner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.georgejrdev.study_planner.model.Planner;
import com.georgejrdev.study_planner.model.User;

public interface PlannerRepository extends JpaRepository<Planner, Long> {
    List<Planner> findByUser(User user);
    List<Planner> findAllByDeleted(boolean deleted);
}