package net.filmos.az.gui.input;

import javafx.scene.Node;
import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.ColorableDisplayElement;
import net.filmos.az.gui.base.DisplayElement;

public class BinaryInputDisplay_Color extends BinaryInputDisplay {
    private final ColorableDisplayElement rootElement;
    private final ColorPalette colors;

    public BinaryInputDisplay_Color(ColorableDisplayElement element, ColorPalette colorPalette) {
        rootElement = element;
        colors = colorPalette;
    }

    @Override
    protected void updateState() {
        Color newColor;
        if(state) newColor = colors.getContentActive();
        else newColor = colors.getContent();

        rootElement.setColor(newColor);
    }

    public Node getNode() {
        return rootElement.getNode();
    }

    @Override
    public DisplayElement getDisplayElement() {return rootElement;}
}
