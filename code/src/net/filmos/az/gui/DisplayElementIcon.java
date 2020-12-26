package net.filmos.az.gui;

import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import net.filmos.az.colors.Color;
import org.jetbrains.annotations.NotNull;
import org.kordamp.ikonli.javafx.FontIcon;

import java.util.Random;

public class DisplayElementIcon extends DisplayElement {
    private final FontIcon icon;
    private String iconName;
    private String size;
    private Color color;

    // TODO: change size from string to cssSize class
    public DisplayElementIcon(String iconName, String size, Color color) {
        icon = new FontIcon();
        this.iconName = iconName;
        this.size = size;
        this.color = color;

        updateStyle();
    }

    @Override
    public Node getNode() {return icon;}

    private void updateStyle() {
        icon.setStyle("-fx-icon-color: "+color.toHexString()
                    +";-fx-icon-size: "+size
                    +";-fx-icon-code: "+iconName
                    +";");
    }
}
