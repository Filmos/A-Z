package net.filmos.az.gui.panels;

import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.TextAlignment;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.elements.DE_Text;

public class Panel_NewEvent extends DisplayElement {
    private final StackPane root;
    private final PB_IconSelector iconSelector;

    public Panel_NewEvent(ColorPalette palette) {
        root = new StackPane();
        iconSelector = new PB_IconSelector(palette);
        root.getChildren().add(iconSelector.getNode());
        constructPanel(palette);
    }

    private void constructPanel(ColorPalette palette) {
        DE_Text title = new DE_Text(Font.font("Verdana", FontWeight.BOLD, 32), palette.getHeader());
        title.addText("Add new event");
        title.setTextAlignment(TextAlignment.CENTER);
        title.getNode().setTranslateY(-263);
        root.getChildren().add(title.getNode());
        StackPane.setAlignment(title.getNode(), Pos.CENTER);
    }

    @Override
    public Node getNode() {
        return root;
    }
}
