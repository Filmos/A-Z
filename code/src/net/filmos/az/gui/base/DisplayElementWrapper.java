package net.filmos.az.gui.base;

import javafx.scene.Node;

public abstract class DisplayElementWrapper {
    public Node getWrappedNode() {return getDisplayElement().getNode();}
    public abstract DisplayElement getDisplayElement();
}
