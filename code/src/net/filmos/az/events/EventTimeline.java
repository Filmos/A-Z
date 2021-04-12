package net.filmos.az.events;

import javafx.util.Pair;
import org.jetbrains.annotations.NotNull;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

public class EventTimeline {
    private final NavigableSet<LocalDateTime> timestamps = new TreeSet<>();
    private final Map<LocalDateTime, FutureEvent> timestampedEvents = new HashMap<>();


    public boolean addEvent(@NotNull FutureEvent event, @NotNull LocalDateTime time) {
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


    // TODO: improve timeline scoring
    public Double getTimelineScore() {
        double totalLoss = 0d;
        for(Map.Entry<LocalDateTime, FutureEvent> timestamp : timestampedEvents.entrySet()) {
            totalLoss += timestamp.getValue().getWeightedLoss(timestamp.getKey());
        }
        return totalLoss;
    }

    private LocalDateTime getEventEnd(LocalDateTime timestamp) {
        if(timestamp == null) return LocalDateTime.now().minusDays(7);
        FutureEvent event = timestampedEvents.get(timestamp);
        if(event == null) return LocalDateTime.now().minusDays(7);
        return timestamp.plusSeconds(event.getEstimatedTimeSeconds());
    }

    public static EventTimeline fromEventList(List<FutureEvent> events) {
        EventTimeline timeline = new EventTimeline();
        List<FutureEvent> orderedEvents = orderEventList(events);
        for(FutureEvent event : orderedEvents) {
            try {
                timeline.smartAddEvent(event);
            } catch (ZeroDurationEventException e) {
                e.printStackTrace();
            }
        }
        return timeline;
    }
    private static List<FutureEvent> orderEventList(List<FutureEvent> events) {return orderEventList(events, LocalDateTime.now());}
    private static List<FutureEvent> orderEventList(List<FutureEvent> events, LocalDateTime startReferencePoint) {
        if(events.size()<=1) return events;

        Duration combinedEventDuration = Duration.ofSeconds(0);
        for(FutureEvent event : events)
            combinedEventDuration = combinedEventDuration.plus(event.getEstimatedTime());
        LocalDateTime referencePoint = startReferencePoint.plus(combinedEventDuration.dividedBy(2));

        List<Pair<Double, FutureEvent>> anchoredEvents = new ArrayList<>();
        for(FutureEvent event : events)
            anchoredEvents.add(new Pair<>(event.getWeightedLoss(referencePoint), event));
        anchoredEvents.sort(Comparator.comparing(p -> -p.getKey()));
        List<FutureEvent> orderedEvents = anchoredEvents.stream().map(Pair::getValue).collect(Collectors.toList());

        List<FutureEvent> listStart = orderedEvents.subList(0, orderedEvents.size()/2);
        List<FutureEvent> listEnd = orderedEvents.subList(orderedEvents.size()/2, orderedEvents.size());

        listStart = orderEventList(listStart, startReferencePoint);
        listEnd = orderEventList(listEnd, referencePoint);
        listStart.addAll(listEnd);

        return listStart;
    }
    public void smartAddEvent(FutureEvent event) throws ZeroDurationEventException {
        LocalDateTime spot = findSpotAfter(event.getEstimatedTime(), LocalDateTime.now());
        addEvent(event, spot);
    }

    public List<FutureEvent> getOrderedEvents() {
        List<FutureEvent> orderedEvents = new ArrayList<>();
        for(LocalDateTime stamp : timestamps)
            orderedEvents.add(timestampedEvents.get(stamp));
        return orderedEvents;
    }

    public static EventTimeline _getTimescaleDisplay() {
        List<FutureEvent> timemarks = new ArrayList<>();

        for(int i=1;i<4;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusMinutes(i*15), i*15+" minutes", "dashicons-heart"));
        timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(1), "1 hour", "dashicons-warning"));
        for(int i=3;i<7;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusMinutes(i*30), ((double) i)/2+" hours", "dashicons-heart"));
        timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(4), "4 hours", "dashicons-warning"));
        for(int i=3;i<6;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(i*2), i*2+" hours", "dashicons-heart"));
        for(int i=3;i<6;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(i*4), i*4+" hours", "dashicons-heart"));
        timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(24), "24 hours", "dashicons-warning"));
        for(int i=5;i<9;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(i*6), (i/4)+" days"+(i%4==0?"":" "+i%4*6+" hours"), "dashicons-heart"));
        for(int i=7;i<9;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusHours(i*8), (i/3)+" days"+(i%3==0?"":" "+i%3*8+" hours"), "dashicons-heart"));
        timemarks.add(_exampleEvent(LocalDateTime.now().plusDays(3), "3 days", "dashicons-warning"));
        for(int i=4;i<9;i++) timemarks.add(_exampleEvent(LocalDateTime.now().plusDays(i), i+" days", "dashicons-heart"));

        return EventTimeline.fromEventList(timemarks);
    }
    private static FutureEvent _exampleEvent(LocalDateTime deadline, String title, String iconCode) {
        FutureEvent event = new HardDeadlineEvent(deadline, java.time.Duration.ofHours(1), FutureEvent.Importance.POTENTIAL);
        event.setDetails(title, "", iconCode);
        return event;
    }
}
