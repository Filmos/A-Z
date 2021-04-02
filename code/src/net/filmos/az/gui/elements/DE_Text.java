package net.filmos.az.gui.elements;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.layout.VBox;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.scene.text.TextAlignment;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.base.DisplayElement;
import org.jetbrains.annotations.NotNull;

public class DE_Text extends DisplayElement {
    private final VBox outerNode;
    private final Font font;
    private final Color defaultColor;

    public DE_Text(Font defaultFont, @NotNull Color defaultColor) {
        outerNode = new VBox();
        outerNode.setAlignment(Pos.CENTER);
        outerNode.setPickOnBounds(false);
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
        textNode.wrappingWidthProperty().bind(outerNode.widthProperty().subtract(16));
        outerNode.getChildren().add(textNode);
    }

    private javafx.scene.paint.Color convertToPaintColor(Color color) {
        if(color == null) return defaultColor.toPaintColor();
        return color.toPaintColor();
    }

    public void setTextAlignment(TextAlignment alignment) {
        outerNode.getChildren().forEach((Node textNode) -> ((Text) textNode).setTextAlignment(alignment));
    }
}
