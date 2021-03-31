package net.filmos.az.gui.base;

import javafx.scene.Node;
import net.filmos.az.Hub;

public interface InterfaceSegment {
    String getName();
    Node buildNode(Hub hub);
}
