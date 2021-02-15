package net.filmos.az.gui;

import javafx.scene.Node;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import net.filmos.az.colors.Color;
import org.jetbrains.annotations.NotNull;

public class DisplayElementText extends DisplayElement {
    private final VBox outerNode;
    private final Font font;
    private final Color defaultColor;

    public DisplayElementText(Font defaultFont, @NotNull Color defaultColor) {
        outerNode = new VBox();
        outerNode.setStyle("-fx-padding: 8;");
        font = defaultFont;
        this.defaultColor = defaultColor;
    }

    @Override
    public Node getNode() {return outerNode;}

    public void addText(String text) {addText(text, null);}
    public void addText(String text, Color color) {
        Text textNode = new Text(text);
        textNode.setFont(font);
        textNode.setFill(convertToPaintColor(color));
        outerNode.getChildren().add(textNode);
    }

    private javafx.scene.paint.Color convertToPaintColor(Color color) {
        if(color == null) return defaultColor.toPaintColor();
        return color.toPaintColor();
    }
}
