package net.filmos.az.gui.input;

import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.base.DisplayElementWrapper;

public abstract class BinaryInputDisplay extends DisplayElementWrapper {
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
