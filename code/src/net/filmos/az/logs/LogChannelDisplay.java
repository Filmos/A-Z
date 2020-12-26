package net.filmos.az.logs;

import net.filmos.az.colors.Color;
import net.filmos.az.gui.DisplayElementText;

public class LogChannelDisplay implements LogChannel{
    private DisplayElementText displayNode;

    @Override
    public String getName() {return "display";}
    public LogChannelDisplay(DisplayElementText displayNode) {
        this.displayNode = displayNode;
    }

    @Override
    public void log(LogMessage message) {
        displayNode.addText(message.getMessage(), message.getColor());
    }
}
