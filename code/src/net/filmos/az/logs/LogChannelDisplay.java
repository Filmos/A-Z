package net.filmos.az.logs;

import net.filmos.az.gui.DE_Text;

public class LogChannelDisplay implements LogChannel{
    private DE_Text displayNode;

    @Override
    public String getName() {return "display";}
    public LogChannelDisplay(DE_Text displayNode) {
        this.displayNode = displayNode;
    }

    @Override
    public void log(LogMessage message) {
        displayNode.addText(message.getMessage(), message.getColor());
    }
}
