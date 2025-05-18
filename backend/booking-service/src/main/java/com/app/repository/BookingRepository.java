package com.app.repository;

import com.app.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByWorkspaceIdAndStartTimeBeforeAndEndTimeAfter(Long workspaceId, LocalDateTime end, LocalDateTime start);
    List<Booking> findByUserId(Long userId);
}
