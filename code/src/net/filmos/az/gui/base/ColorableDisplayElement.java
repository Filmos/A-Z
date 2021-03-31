package net.filmos.az.gui.base;

import net.filmos.az.colors.Color;

public abstract class ColorableDisplayElement extends DisplayElement {
    private Color color;

    public void setColor(Color color) {
        this.color = color;
        updateColor(color);
    }
    public Color getColor() {
        return color;
    }

    abstract protected void updateColor(Color color);
}
