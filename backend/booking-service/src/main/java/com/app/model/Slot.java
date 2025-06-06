package com.app.model;

import java.time.LocalDateTime;

public class Slot {
    private LocalDateTime start;
    private LocalDateTime end;

    public Slot(LocalDateTime start, LocalDateTime end) {
        this.start = start;
        this.end = end;
    }

    public boolean overlapsWith(LocalDateTime bookingStart, LocalDateTime bookingEnd) {
        return !(end.isBefore(bookingStart) || start.isAfter(bookingEnd));
    }

    @Override
    public String toString() {
        return start + " - " + end;
    }
}
