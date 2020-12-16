package net.filmos.az.logs;

import net.filmos.az.colors.Color;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

public final class LogDistributor {
    List<LogChannel> channels = new ArrayList<>();
    private enum LogType {
        Info(162, 237, 104),
        Important(77, 213, 254),
        Warn(239, 226, 107),
        Error(255, 56, 66);

        Color color;
        LogType(int red, int green, int blue) {
            color = new Color(red, green, blue);
        }
    }

    public void addChannel(LogChannel channel) {
        channels.add(channel);
    }

    public void log(String messageContent, String additionalInformation) {
        LogMessage message = createMessage(messageContent, additionalInformation, LogType.Info);
        distributeMessage(message);
    }
    public void logImportant(String messageContent, String additionalInformation) {
        LogMessage message = createMessage(messageContent, additionalInformation, LogType.Important);
        distributeMessage(message);
    }
    public void logWarning(String messageContent, String additionalInformation) {
        LogMessage message = createMessage(messageContent, additionalInformation, LogType.Warn);
        distributeMessage(message);
    }
    public void logError(String messageContent, String additionalInformation) {
        LogMessage message = createMessage(messageContent, additionalInformation, LogType.Error);
        distributeMessage(message);
    }

    private LogMessage createMessage(String messageContent, String additionalInformation, @NotNull LogType type) {
        LogMessage message = new LogMessage(messageContent, additionalInformation);
        message.setColor(type.color);
        return message;
    }
    private void distributeMessage(LogMessage message) {
        channels.forEach(channel -> channel.log(message));
    }
}
