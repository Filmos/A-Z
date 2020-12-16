package net.filmos.az.logs;

import net.filmos.az.colors.Color;

public class LogMessage {
    private final String message;
    private final String additionalInformation;
    private Color color;

    public LogMessage(String message, String additionalInformation) {
        this.message = message;
        this.additionalInformation = additionalInformation;
    }

    public void setColor(Color color) {this.color = color;}

    public String getMessage() {return message;}
    public String getAdditionalInformation() {return additionalInformation;}
    public Color getColor() {return color;}
}
