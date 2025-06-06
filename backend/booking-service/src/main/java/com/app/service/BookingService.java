package com.app.service;

import com.app.dto.BookingRequest;
import com.app.exception.NotFoundException;
import com.app.model.Booking;
import com.app.model.Slot;
import com.app.model.User;
import com.app.model.Workspace;
import com.app.repository.BookingRepository;
import com.app.repository.UserRepository;
import com.app.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;

    public Booking createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        Workspace workspace = workspaceRepository.findById(request.getWorkspaceId())
                .orElseThrow(() -> new NotFoundException("Место не найдено"));
        return bookingRepository.save(mapToBooking(user, workspace, request));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public void cancelBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new NotFoundException("Бронирование не найдено");
        }
        bookingRepository.deleteById(bookingId);
    }

    public Booking rescheduleBooking(Long bookingId, BookingRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Бронирование не найдено"));

        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        return bookingRepository.save(booking);
    }

    private Booking mapToBooking(User user, Workspace workspace, BookingRequest req) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setWorkspace(workspace);
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        return booking;
    }

    private List<Slot> generateSlots(LocalDate date) {
        List<Slot> slots = new ArrayList<>();
        LocalDateTime start = date.atTime(8, 0); // 8:00 утра
        LocalDateTime end = date.atTime(20, 0);  // 8:00 вечера

        while (start.isBefore(end)) {
            LocalDateTime slotEnd = start.plusHours(1);
            slots.add(new Slot(start, slotEnd));
            start = slotEnd;
        }
        return slots;
    }

    public List<String> getAvailableSlots(Long workspaceId, LocalDate date) {
        List<Slot> allSlots = generateSlots(date);

        List<Booking> bookings = bookingRepository
            .findByWorkspaceIdAndDate(workspaceId, date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        List<Slot> available = allSlots.stream()
            .filter(slot -> bookings.stream()
                .noneMatch(b -> slot.overlapsWith(b.getStartTime(), b.getEndTime())))
            .toList();

        return available.stream()
            .map(Slot::toString)
            .toList();
    }
}
