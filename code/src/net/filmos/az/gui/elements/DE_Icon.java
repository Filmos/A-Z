package net.filmos.az.gui.elements;

import javafx.scene.Node;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.base.ColorableDisplayElement;
import org.kordamp.ikonli.javafx.FontIcon;

public class DE_Icon extends ColorableDisplayElement {
    private final FontIcon icon;
    private String iconName;
    private int size;

    public DE_Icon(String iconName, int size, Color color) {
        this.iconName = iconName;
        this.size = size;

        icon = new FontIcon();
        icon.setIconSize(size);
        icon.setIconLiteral(iconName);

        setColor(color);
    }

    @Override
    public Node getNode() {return icon;}

    @Override
    protected void updateColor(Color color) {
        icon.setIconColor(color.toPaintColor());
    }
}
