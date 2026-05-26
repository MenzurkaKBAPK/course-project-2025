package com.app.repository;

import com.app.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByWorkspaceIdAndStartTimeBeforeAndEndTimeAfter(Long workspaceId, LocalDateTime end, LocalDateTime start);
    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.workspace.id = :workspaceId AND b.startTime < :endOfDay AND b.endTime > :startOfDay")
    List<Booking> findByWorkspaceIdAndDate(@Param("workspaceId") Long workspaceId,
                                           @Param("startOfDay") LocalDateTime startOfDay,
                                           @Param("endOfDay") LocalDateTime endOfDay);
}
