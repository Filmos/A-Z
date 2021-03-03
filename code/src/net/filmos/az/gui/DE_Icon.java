package net.filmos.az.gui;

import javafx.scene.Node;
import net.filmos.az.colors.Color;
import org.kordamp.ikonli.javafx.FontIcon;

public class DE_Icon extends DisplayElement {
    private final FontIcon icon;
    private String iconName;
    private int size;
    private Color color;

    public DE_Icon(String iconName, int size, Color color) {
        icon = new FontIcon();
        this.iconName = iconName;
        this.size = size;
        this.color = color;

        updateStyle();
    }

    @Override
    public Node getNode() {return icon;}

    private void updateStyle() {
        icon.setIconSize(size);
        icon.setIconLiteral(iconName);
        icon.setIconColor(color.toPaintColor());
    }
}
