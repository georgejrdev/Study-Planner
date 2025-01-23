package com.georgejrdev.study_planner.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.georgejrdev.study_planner.model.User;
import com.georgejrdev.study_planner.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void create(String username, String password) {
        User user = new User(username, passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public User login(String username, String rawPassword) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPass())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}