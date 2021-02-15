package net.filmos.az.events;

import java.util.Date;
import java.util.List;

public class HardDeadlineEvent extends FutureEvent {
    private Date deadline;
    private EstimatedCompletionTime estimatedTime;
    private Importance importance;

    public HardDeadlineEvent(String title, String description, String icon) {
        super(title, description, icon);
    }

    public void setDeadline(Date deadline, EstimatedCompletionTime estimatedTime, Importance importance) {
        this.deadline = deadline;
        this.estimatedTime = estimatedTime;
        this.importance = importance;
    }

    public Importance getImportance() {return importance;}
    public EstimatedCompletionTime getEstimatedTime() {return estimatedTime;}
    public Date getDeadline() {return deadline;}

    public static List<HardDeadlineEvent> sortEvents(List<HardDeadlineEvent> events) {
        events.sort((lhs, rhs) -> {
            int compareDeadlines = lhs.getDeadline().compareTo(rhs.getDeadline());
            return (compareDeadlines != 0) ? compareDeadlines : rhs.getImportance().value.compareTo(lhs.getImportance().value);
        });
        return events;
    }
}
