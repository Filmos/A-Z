package net.filmos.az;

import javafx.stage.Stage;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.InterfaceSegment;
import net.filmos.az.gui.panels.PB_IconSelector;
import net.filmos.az.gui.panels.Panel_NewEvent;
import net.filmos.az.gui.windows.StageNodePositioner;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogDistributor;
import org.jetbrains.annotations.NotNull;

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

    }
}
