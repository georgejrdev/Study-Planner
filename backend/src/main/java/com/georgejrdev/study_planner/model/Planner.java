package com.georgejrdev.study_planner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.Date;

import com.georgejrdev.study_planner.common.enums.Level;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Planner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(length = 255, nullable = false)
    private String name;

    @Column(length = 500, nullable = false)  
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Level urgency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Level impact;

    @Column(nullable = false)
    private int priorityLevel;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private boolean deleted;

    @ManyToOne
    @JoinColumn(name = "userID", nullable = false)
    private User user;

    public Planner(String name, String description, Level urgency, Level impact, int priorityLevel, Date date, boolean deleted, User user) {
        this.name = name;
        this.description = description;
        this.urgency = urgency;
        this.impact = impact;
        this.priorityLevel = priorityLevel;
        this.date = date;
        this.deleted = deleted;
        this.user = user;
    }
}