package net.filmos.az.events;

import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorGradient;
import net.filmos.az.colors.ColorPalette;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static java.time.temporal.ChronoUnit.SECONDS;

public class HardDeadlineEvent extends FutureEvent {

    public HardDeadlineEvent(LocalDateTime deadline, Duration estimatedTime, Importance importance) {
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

    @Override
    public Map<Double, Color> getColorMarks() {
        ColorPalette palette = ColorPalette.defaultPalette();
        ColorGradient gradient = new ColorGradient(palette.getContentInactive(), palette.getContentDanger());
        Map<Double, Color> colorMarks = new HashMap<>();

        colorMarks.put(0.25, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusMinutes(20))));
        colorMarks.put(0.35, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusHours(3))));
        colorMarks.put(0.45, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusHours(8))));
        colorMarks.put(0.55, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusHours(24))));
        colorMarks.put(0.65, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusDays(3))));
        colorMarks.put(0.75, gradient.getColor(getNormalizedLoss(LocalDateTime.now().plusDays(7))));
        return colorMarks;
    }
}
