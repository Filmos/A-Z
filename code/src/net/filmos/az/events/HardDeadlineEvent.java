package net.filmos.az.events;

import java.time.Duration;
import java.time.LocalDateTime;

import static java.time.temporal.ChronoUnit.SECONDS;

public class HardDeadlineEvent extends FutureEvent {

    public HardDeadlineEvent(LocalDateTime deadline, Duration estimatedTime, Loss importance) {
        super(deadline, estimatedTime, importance);
    }

    @Override
    public double getNormalizedLoss(LocalDateTime date) {
        LocalDateTime tooLate = getDeadline().minusSeconds((long) (getEstimatedTimeSeconds()*0.35));
        if(date.isAfter(tooLate)) return 1;

        LocalDateTime lastChance = getDeadline().minusSeconds((long) (getEstimatedTimeSeconds()*0.75));
        if(date.isAfter(lastChance)) return 1-date.until(tooLate, SECONDS)/((double) lastChance.until(tooLate, SECONDS))*0.15;

        LocalDateTime estimatedTime = getDeadline().minusSeconds(getEstimatedTimeSeconds());
        if(date.isAfter(estimatedTime)) return 0.85-date.until(lastChance, SECONDS)/((double) estimatedTime.until(lastChance, SECONDS))*0.3;

        LocalDateTime comfortBuffer = getDeadline().minusSeconds((long) (getEstimatedTimeSeconds()*1.5+3600));
        if(date.isAfter(comfortBuffer)) return 0.55-date.until(estimatedTime, SECONDS)/((double) comfortBuffer.until(estimatedTime, SECONDS))*0.5;

        LocalDateTime startDrop = getDeadline().minusSeconds(getEstimatedTimeSeconds()*12+72*3600);
        if(date.isAfter(startDrop)) return 0.05-date.until(comfortBuffer, SECONDS)/((double) startDrop.until(comfortBuffer, SECONDS))*0.05;

        return 0;
    }
}
