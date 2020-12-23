package net.filmos.az;

import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.text.Font;
import net.filmos.az.gui.DisplayElementText;
import net.filmos.az.logs.LogChannel;
import net.filmos.az.logs.LogChannelDisplay;
import net.filmos.az.logs.LogDistributor;
import org.jetbrains.annotations.NotNull;

public class Hub {
    private final LogDistributor logDistributor = new LogDistributor();

    public void log(String message) {log(message, "");}
    public void log(String message, String additionalInformation) {logDistributor.log(message, additionalInformation);}
    public void logImportant(String message) {logImportant(message, "");}
    public void logImportant(String message, String additionalInformation) {logDistributor.logImportant(message, additionalInformation);}
    public void logWarning(String message) {logWarning(message, "");}
    public void logWarning(String message, String additionalInformation) {logDistributor.logWarning(message, additionalInformation);}
    public void logError(String message) {logError(message, "");}
    public void logError(String message, String additionalInformation) {logDistributor.logError(message, additionalInformation);}

    public void addLogChannel(LogChannel logChannel) {
        logDistributor.addChannel(logChannel);
    }

    // TODO: major rework of UI initialization
    public void addUserInterface(@NotNull Scene scene) {
        DisplayElementText text = new DisplayElementText(Font.font("consolas", 18), new net.filmos.az.colors.Color(255, 255, 255));
        ((Group) scene.getRoot()).getChildren().add(text.getNode());
        addLogChannel(new LogChannelDisplay(text));
        text.addText("Hello");
        text.addText("there");
    }
}
