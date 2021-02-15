package net.filmos.az.events;

import java.time.Duration;
import java.util.Date;

public class FutureEvent {
    public enum Importance {
        OPTIONAL(0),
        LOW(1),
        MEDIUM(2),
        HIGH(3);

        Integer value;
        Importance(Integer val) {
            value = val;
        }

    }
    public enum EstimatedCompletionTime {
        INSTANT(Duration.ofMinutes(5)),
        QUICK(Duration.ofMinutes(30)),
        SHORT(Duration.ofMinutes(90)),
        MEDIUM(Duration.ofHours(4)),
        LONG(Duration.ofHours(7));

        Duration estimatedTime;
        EstimatedCompletionTime(Duration time) {
            estimatedTime = time;
        }
    }

    private final String title;
    private final String description;
    private final String icon;

    public FutureEvent(String title, String description, String icon) {
        this.title = title;
        this.description = description;
        this.icon = icon;
    }

    public String getTitle() {return title;}
    public String getDescription() {return description;}
    public String getIcon() {return icon;}
}
