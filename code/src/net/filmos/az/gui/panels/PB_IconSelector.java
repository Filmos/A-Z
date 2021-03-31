package net.filmos.az.gui.panels;

import javafx.scene.Node;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.ScrollEvent;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Polygon;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.DisplayElementGroup;
import net.filmos.az.gui.elements.DE_Icon;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay_Color;
import net.filmos.az.gui.input.NodeSelector;
import org.kordamp.ikonli.dashicons.Dashicons;

import java.util.ArrayList;
import java.util.List;

public class PB_IconSelector extends PanelBase {
    private final StackPane root;

    public PB_IconSelector() {
        root = new StackPane();
        ColorPalette palette = ColorPalette.defaultPalette();
        createBackground(palette);
        createIconList(palette);
    }

    private void createBackground(ColorPalette palette) {
        Polygon hexagon = new Polygon();
        hexagon.getPoints().addAll(
                503.0,0.0,
                167.0,0.0,
                0.0,290.0,
                168.0,580.0,
                502.0,580.0,
                670.0,290.0);

        hexagon.setFill(palette.getBackground().toPaintColor());
        hexagon.setStroke(palette.getBackgroundBorder().toPaintColor());
        hexagon.setStrokeWidth(4.0);

        root.getChildren().add(hexagon);
    }
    private void createIconList(ColorPalette palette) {
        Dashicons[] iconsRaw = Dashicons.values();
        List<BinaryInputDisplay> iconInput = new ArrayList<>();
        DisplayElementGroup iconGroup = new DisplayElementGroup();

        for (Dashicons iconCode : iconsRaw) {
            DE_Icon icon = new DE_Icon(iconCode.getDescription(), 40, palette.getContent());
            iconInput.add(new BinaryInputDisplay_Color(icon, palette));
            iconGroup.addLabeledElement(icon, iconCode.getDescription());
        }
        NodeSelector userSelector = new NodeSelector(iconInput);


        DE_RotatingDisplay pane = new DE_RotatingDisplay(560d, iconGroup);
        pane.setPadding(4);
        root.getChildren().add(pane.getNode());


        TextField textField = new TextField();
        textField.setMaxWidth(222.5);
        textField.setTranslateY(-222.5);
        textField.setOnKeyTyped((KeyEvent event) -> {
            iconGroup.setFilter(textField.getText());
            pane.updateNodes();
        });
        root.getChildren().add(textField);
    }

    @Override
    public Node getNode() {
        return root;
    }
}