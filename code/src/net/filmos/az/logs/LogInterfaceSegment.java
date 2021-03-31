package net.filmos.az.logs;

import javafx.scene.Node;
import javafx.scene.text.Font;
import net.filmos.az.Hub;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.elements.DE_Text;
import net.filmos.az.gui.base.InterfaceSegment;

public class LogInterfaceSegment implements InterfaceSegment {
    @Override
    public String getName() {return "debug log";}

    @Override
    public Node buildNode(Hub hub) {
        DE_Text text = new DE_Text(Font.font("consolas", 18), new Color(255, 255, 255));
        hub.addLogChannel(new LogChannelDisplay(text));
        return text.getNode();
    }
}
