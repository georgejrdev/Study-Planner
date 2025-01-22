package com.georgejrdev.study_planner.service;

import java.sql.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.georgejrdev.study_planner.common.enums.Level;
import com.georgejrdev.study_planner.model.Planner;
import com.georgejrdev.study_planner.model.User;
import com.georgejrdev.study_planner.repository.PlannerRepository;

@Service
public class PlannerService {

    private final PlannerRepository plannerRepository;

    // ======================================================================================================
    // JUST USER CAN MANIPULATE A TASK RELATED TO HIM, IMPLEMENT THIS LATER, EXCEPT METHODS CALLED BY SYSTEM
    // ======================================================================================================

    public PlannerService(PlannerRepository plannerRepository) {
        this.plannerRepository = plannerRepository;
    }

    public void createTask(String name, String description, Level urgency, Level impact, Date date, User user) {
        int priorityLevel = getPriorityLevel(urgency, impact);
        
        Planner planner = new Planner(name, description, urgency, impact, priorityLevel, date, false, user);
        plannerRepository.save(planner);
    }

    public void updateTask(Long id,String name, String description, Level urgency, Level impact, Date date) {
        Planner planner = plannerRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        planner.setName(name);
        planner.setDescription(description);
        planner.setUrgency(urgency);
        planner.setImpact(impact);
        planner.setPriorityLevel(getPriorityLevel(urgency, impact));
        planner.setDate(date);

        plannerRepository.save(planner);
    }

    public void markTaskAsDeleted(Long id) {
        Planner planner = plannerRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        planner.setDeleted(true);
        plannerRepository.save(planner);
    }

    public void deleteTask(Long id) {
        if (!plannerRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        plannerRepository.deleteById(id);
    }

    public List<Planner> getAllTasksByUser(User user) {
        return plannerRepository.findByUser(user);
    }

    public Planner getTaskById(Long id) {
        return plannerRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    public List<Planner> getAllTasksMarkedAsDelete(){
        return plannerRepository.findAllByDeleted(true);
    }

    private int getPriorityLevel(Level urgency, Level impact) {

        if (urgency == Level.HIGH && impact == Level.HIGH) return 0;
        if (urgency == Level.HIGH && impact == Level.MEDIUM) return 1;
        if (urgency == Level.HIGH && impact == Level.LOW) return 2;
        if (urgency == Level.MEDIUM && impact == Level.HIGH) return 3;
        if (urgency == Level.MEDIUM && impact == Level.MEDIUM) return 4;
        if (urgency == Level.MEDIUM && impact == Level.LOW) return 5;
        if (urgency == Level.LOW && impact == Level.HIGH) return 6;
        if (urgency == Level.LOW && impact == Level.MEDIUM) return 7;
        if (urgency == Level.LOW && impact == Level.LOW) return 8;

        return 8;
    }
}