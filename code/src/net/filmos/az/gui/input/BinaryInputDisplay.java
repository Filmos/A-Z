package net.filmos.az.gui.input;

import net.filmos.az.gui.base.DisplayElement;

public abstract class BinaryInputDisplay extends DisplayElement {
    protected boolean state = false;

    public void activate() {
        setActive(true);
    }
    public void deactivate() {
        setActive(false);
    }
    public boolean toggleActive() {
        setActive(!getActive());
        return state;
    }

    public void setActive(boolean newState) {
        state = newState;
        updateState();
    }
    public boolean getActive() {
        return state;
    }

    protected abstract void updateState();
}
