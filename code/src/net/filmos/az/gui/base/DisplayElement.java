package net.filmos.az.gui.base;

import javafx.scene.Node;

public abstract class DisplayElement {
    private static int IDCounter = 0;
    private int ID;

    public DisplayElement() {
        ID = IDCounter;
        IDCounter += 1;
    }

    public abstract Node getNode();
    public int getID() {return ID;}
}
