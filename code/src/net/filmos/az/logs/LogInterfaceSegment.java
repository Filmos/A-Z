package net.filmos.az.logs;

import javafx.scene.Node;
import javafx.scene.text.Font;
import net.filmos.az.Hub;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.DisplayElementText;
import net.filmos.az.gui.InterfaceSegment;

public class LogInterfaceSegment implements InterfaceSegment {
    @Override
    public String getName() {return "debug log";}

    @Override
    public Node buildNode(Hub hub) {
        DisplayElementText text = new DisplayElementText(Font.font("consolas", 18), new Color(255, 255, 255));
        hub.addLogChannel(new LogChannelDisplay(text));
        return text.getNode();
    }
}
