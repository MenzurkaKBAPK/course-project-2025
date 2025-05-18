package com.app.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {

    @NotNull(message = "Идентификатор пользователя обязателен")
    private Long userId;

    @NotNull(message = "Идентификатор места обязателен")
    private Long workspaceId;

    @NotNull(message = "Дата и время начала обязательны")
    @Future(message = "Время начала должно быть в будущем")
    private LocalDateTime startTime;

    @NotNull(message = "Дата и время окончания обязательны")
    @Future(message = "Время окончания должно быть в будущем")
    private LocalDateTime endTime;
}
