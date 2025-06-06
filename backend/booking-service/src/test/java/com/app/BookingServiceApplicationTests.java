package com.app;

import com.app.dto.BookingRequest;
import com.app.exception.NotFoundException;
import com.app.model.Booking;
import com.app.model.User;
import com.app.model.Workspace;
import com.app.repository.BookingRepository;
import com.app.repository.UserRepository;
import com.app.repository.WorkspaceRepository;
import com.app.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BookingServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	private BookingRepository bookingRepository;
	private UserRepository userRepository;
	private WorkspaceRepository workspaceRepository;
	private BookingService bookingService;

	@BeforeEach
	void setUp() {
		bookingRepository = mock(BookingRepository.class);
		userRepository = mock(UserRepository.class);
		workspaceRepository = mock(WorkspaceRepository.class);
		bookingService = new BookingService(bookingRepository, userRepository, workspaceRepository);
	}

	@Test
	void testCreateBookingSuccess() {
		BookingRequest request = new BookingRequest();
		request.setUserId(1L);
		request.setWorkspaceId(1L);
		request.setStartTime(LocalDateTime.now().plusHours(1));
		request.setEndTime(LocalDateTime.now().plusHours(2));

		User user = new User(1L, "testuser");
		Workspace workspace = new Workspace(1L, "Desk 1", "Floor 1");

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(workspaceRepository.findById(1L)).thenReturn(Optional.of(workspace));
		when(bookingRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		Booking booking = bookingService.createBooking(request);

		assertNotNull(booking);
		assertEquals(user, booking.getUser());
		assertEquals(workspace, booking.getWorkspace());
	}

	@Test
	void testCreateBookingUserNotFound() {
		BookingRequest request = new BookingRequest();
		request.setUserId(1L);
		request.setWorkspaceId(1L);
		request.setStartTime(LocalDateTime.now().plusHours(1));
		request.setEndTime(LocalDateTime.now().plusHours(2));

		when(userRepository.findById(1L)).thenReturn(Optional.empty());

		assertThrows(NotFoundException.class, () -> bookingService.createBooking(request));
	}

	@Test
	void testCreateBookingWorkspaceNotFound() {
		BookingRequest request = new BookingRequest();
		request.setUserId(1L);
		request.setWorkspaceId(1L);
		request.setStartTime(LocalDateTime.now().plusHours(1));
		request.setEndTime(LocalDateTime.now().plusHours(2));

		User user = new User(1L, "testuser");

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(workspaceRepository.findById(1L)).thenReturn(Optional.empty());

		assertThrows(NotFoundException.class, () -> bookingService.createBooking(request));
	}
}
