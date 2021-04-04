package net.filmos.az.events;

import java.time.Duration;
import java.time.LocalDateTime;

public abstract class FutureEvent {
    public enum Importance {
        LACK(1,"Free reschedule"),
        POTENTIAL(3, "Loss of potential"),
        VALUE(8, "Loss of value"),
        RECURSIVE(30, "Recursive loss"),
        COLLABORATIVE(90, "Collaborative loss");

        private Integer value;
        private String name;

        Importance(Integer val, String nam) {
            value = val;
            name = nam;
        }

        public Integer getMultiplier() {return value;}
        public String getName() {return name;}
        public String toString() {return getName();}

    }


    private Importance importance;
    private Duration estimatedTime;
    private String title;
    private String description;
    private String icon;
    private LocalDateTime deadline;

    public String getTitle() {return title;}
    public String getDescription() {return description;}
    public String getIcon() {return icon;}
    public Importance getImportance() {return importance;}
    public Duration getEstimatedTime() {return estimatedTime;}
    public LocalDateTime getDeadline() {return deadline;}

    public FutureEvent(LocalDateTime deadline, Duration estimatedTime, Importance importance) {
        this.deadline = deadline;
        this.estimatedTime = estimatedTime;
        this.importance = importance;
    }

    public void setDetails(String title, String description, String icon) {
        this.title = title;
        this.description = description;
        this.icon = icon;
    }


    public long getEstimatedTimeSeconds() {
        if(estimatedTime == null) return 0;
        return estimatedTime.getSeconds();
    }


    public abstract double getNormalizedLoss(LocalDateTime date);
    public double getWeightedLoss(LocalDateTime date) {
        return getNormalizedLoss(date)*getImportance().getMultiplier();
    }
}
