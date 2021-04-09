package net.filmos.az.events;

import net.filmos.az.colors.Color;
import net.filmos.az.storage.InvalidStorableDictException;
import net.filmos.az.storage.Storable;
import net.filmos.az.storage.StorableDict;

import java.lang.reflect.Constructor;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;

public abstract class FutureEvent implements Storable {
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
    private String storageId;

    public String getTitle() {return title;}
    public String getDescription() {return description;}
    public String getIcon() {return icon;}
    public Importance getImportance() {return importance;}
    public Duration getEstimatedTime() {return estimatedTime;}
    public LocalDateTime getDeadline() {return deadline;}

    public void setStorageId(String storageId) {this.storageId = storageId;}

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


    public StorableDict getStorableDict() {
        StorableDict storableDict = new StorableDict();
        storableDict.put("deadline", deadline.toString());
        storableDict.put("duration", estimatedTime.toString());
        storableDict.put("importance", importance.name());
        storableDict.put("title", title);
        storableDict.put("description", description);
        storableDict.put("icon", icon);
        storableDict.put("type", getClass().getCanonicalName());

        return storableDict;
    }
    public static FutureEvent fromStorableDict(StorableDict storableDict) throws InvalidStorableDictException {
        if(storableDict.get("type") == null) throw new InvalidStorableDictException("Missing type");

        LocalDateTime deadline;
        try {deadline = LocalDateTime.parse(storableDict.get("deadline"));}
        catch (Exception e) {throw new InvalidStorableDictException("Invalid deadline value");}

        Duration duration;
        try {duration = Duration.parse(storableDict.get("duration"));}
        catch (Exception e) {throw new InvalidStorableDictException("Invalid duration value");}

        Importance importance;
        try {importance = Importance.valueOf(storableDict.get("importance"));}
        catch (Exception e) {throw new InvalidStorableDictException("Invalid importance value");}

        try {
            Class<?> c = Class.forName(storableDict.get("type"));
            Constructor<?> cons = c.getConstructor(LocalDateTime.class, Duration.class, Importance.class);
            FutureEvent event = (FutureEvent) cons.newInstance(deadline, duration, importance);
            event.setDetails(storableDict.get("title"), storableDict.get("description"), storableDict.get("icon"));
            return event;
        } catch (Exception e) {
            throw new InvalidStorableDictException("Missing type");
        }
    }

    public abstract Map<Double, Color> getColorMarks();
}
