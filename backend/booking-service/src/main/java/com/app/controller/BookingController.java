package com.app.controller;

import com.app.dto.BookingRequest;
import com.app.model.Booking;
import com.app.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Бронирования", description = "Управление бронированиями")
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Создать новое бронирование")
    @PostMapping
    public ResponseEntity<Booking> book(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(booking);
    }

    @Operation(summary = "Получить все бронирования")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @Operation(summary = "Получить бронирования по ID пользователя")
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @Operation(summary = "Отменить бронирование по ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Перенести бронирование на другое время")
    @PutMapping("/{id}")
    public ResponseEntity<Booking> rescheduleBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest request
    ) {
        Booking updated = bookingService.rescheduleBooking(id, request);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Получить доступные слоты для места на сегодня")
    @GetMapping("/available-slots/{workspaceId}")
    public ResponseEntity<List<String>> getAvailableSlots(@PathVariable Long workspaceId) {
        List<String> slots = bookingService.getAvailableSlots(workspaceId, LocalDate.now());
        return ResponseEntity.ok(slots);
    }
}
