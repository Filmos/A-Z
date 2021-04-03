package net.filmos.az.events;

import net.filmos.az.logs.LogDistributor;
import org.jetbrains.annotations.NotNull;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NavigableSet;
import java.util.TreeSet;

public class EventTimeline {
    private final LogDistributor logger;
    private final NavigableSet<LocalDateTime> timestamps = new TreeSet<>();
    private final Map<LocalDateTime, FutureEvent> timestampedEvents = new HashMap<>();

    public EventTimeline(LogDistributor logDistributor) {
        logger = logDistributor;
    }


    public boolean addEvent(@NotNull FutureEvent event, @NotNull LocalDateTime time) {
        try {
            System.out.println(">"+findSpotAfter(event.getEstimatedTime(), time));
            System.out.println("<"+findSpotBefore(event.getEstimatedTime(), time.plusSeconds(event.getEstimatedTimeSeconds())));
        } catch (ZeroDurationEventException e) {
            e.printStackTrace();
        }
        if(!canAddEvent(event, time)) return false;

        timestamps.add(time);
        timestampedEvents.put(time, event);
        return true;
    }

    public boolean canAddEvent(@NotNull FutureEvent event, @NotNull LocalDateTime time) {
        LocalDateTime timestampBefore = timestamps.floor(time);
        boolean collidesBefore = time.isBefore(getEventEnd(timestampBefore));
        if(collidesBefore) return false;

        LocalDateTime timestampAfter = timestamps.ceiling(time);
        boolean collidesAfter = (timestampAfter != null && time.plusSeconds(event.getEstimatedTimeSeconds()).isAfter(timestampAfter));
        if(collidesAfter) return false;

        return true;
    }


    public LocalDateTime findSpotAfter(Duration duration, @NotNull LocalDateTime time) throws ZeroDurationEventException {
        if(duration == null || duration.isZero()) throw new ZeroDurationEventException("Tried finding after-spot for a zero-duration event");

        LocalDateTime timestampBefore = getEventEnd(timestamps.floor(time));
        if(time.isBefore(timestampBefore)) time = timestampBefore;

        LocalDateTime timestampAfter = timestamps.ceiling(time);
        while(timestampAfter != null && time.plusSeconds(duration.toSeconds()).isAfter(timestampAfter)) {
            time = getEventEnd(timestampAfter);
            timestampAfter = timestamps.ceiling(time);
        }

        return time;
    }

    public LocalDateTime findSpotBefore(Duration duration, @NotNull LocalDateTime time) throws ZeroDurationEventException {
        if(duration == null || duration.isZero()) throw new ZeroDurationEventException("Tried finding after-spot for a zero-duration event");
        time = time.minusSeconds(duration.toSeconds());

        while(true) {
            LocalDateTime timestampBefore = timestamps.floor(time);
            LocalDateTime timestampAfter = timestamps.ceiling(time);

            boolean collidesBefore = (timestampBefore != null && time.isBefore(getEventEnd(timestampBefore)));
            if(collidesBefore) {
                time = timestampBefore.minusSeconds(duration.toSeconds());
                continue;
            }

            boolean collidesAfter = (timestampAfter != null && time.plusSeconds(duration.toSeconds()).isAfter(timestampAfter));
            if(collidesAfter) {
                time = timestampAfter.minusSeconds(duration.toSeconds());
                continue;
            }

            break;
        }

        return time;
    }


    private LocalDateTime getEventEnd(LocalDateTime timestamp) {
        if(timestamp == null) return LocalDateTime.now().minusDays(7);
        FutureEvent event = timestampedEvents.get(timestamp);
        if(event == null) return LocalDateTime.now().minusDays(7);
        return timestamp.plusSeconds(event.getEstimatedTimeSeconds());
    }
}
