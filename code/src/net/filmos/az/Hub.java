package net.filmos.az;

import javafx.stage.Stage;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.events.EventTimeline;
import net.filmos.az.events.FutureEvent;
import net.filmos.az.events.HardDeadlineEvent;
import net.filmos.az.gui.base.InterfaceSegment;
import net.filmos.az.gui.panels.Panel_NewEvent;
import net.filmos.az.gui.windows.StageNodePositioner;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogDistributor;
import org.jetbrains.annotations.NotNull;

import java.time.Duration;
import java.time.LocalDateTime;

public class Hub {
    private final LogDistributor logDistributor = new LogDistributor();
    private StageNodePositioner segmentPositioner;

    public Hub() {
        logImportant("Launching A-Z");
    }

    public void log(String message) {log(message, "");}
    public void log(String message, String additionalInformation) {logDistributor.log(message, additionalInformation);}
    public void logImportant(String message) {logImportant(message, "");}
    public void logImportant(String message, String additionalInformation) {logDistributor.logImportant(message, additionalInformation);}
    public void logWarning(String message) {logWarning(message, "");}
    public void logWarning(String message, String additionalInformation) {logDistributor.logWarning(message, additionalInformation);}
    public void logError(String message) {logError(message, "");}
    public void logError(String message, String additionalInformation) {logDistributor.logError(message, additionalInformation);}

    public void addLogChannel(LogChannel logChannel) {
        log("Adding new "+logChannel.getName()+" log channel...");
        logDistributor.addChannel(logChannel);
    }

    public void setUserInterface(@NotNull Stage stage) {segmentPositioner = new StageNodePositioner(stage);}
    public void addSegment(InterfaceSegment segment) {
        logImportant("Adding interface segment \""+segment.getName()+"\"...");
        segmentPositioner.addNode(segment.buildNode(this));
    }

    public void test() {
        Panel_NewEvent panel = new Panel_NewEvent(ColorPalette.defaultPalette());
//        PB_IconSelector panel = new PB_IconSelector(ColorPalette.defaultPalette());

        segmentPositioner.addNodeCenter(panel.getNode());


        FutureEvent task1 = new HardDeadlineEvent(LocalDateTime.now().plusDays(7), Duration.ofHours(4), FutureEvent.Importance.POTENTIAL);
        log("Too early: "+task1.getNormalizedLoss(LocalDateTime.now()));
        log("Right before: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(2)));
        log("Start decline: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(2).plusHours(6)));
        log("Comfort buffer: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(7).minusHours(7)));
        log("Last chance: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(7).minusHours(4)));
        log("Too late: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(7).minusHours(2)));
        log("Deadline: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(7)));
        log("After deadline: "+task1.getNormalizedLoss(LocalDateTime.now().plusDays(7).plusHours(2)));

        LocalDateTime start = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        EventTimeline line = new EventTimeline(logDistributor);
        logWarning(":"+line.addEvent(task1, start.plusHours(2)));
        logWarning(":"+line.addEvent(task1, start.plusHours(4)));
        logWarning(":"+line.addEvent(task1, start.plusHours(1)));
        logWarning(":"+line.addEvent(task1, start.plusHours(6)));
        logWarning(":"+line.addEvent(task1, start.plusHours(16)));
        logWarning(":"+line.addEvent(task1, start.plusHours(8)));
        logWarning(":"+line.addEvent(task1, start.plusHours(14)));
    }
}
