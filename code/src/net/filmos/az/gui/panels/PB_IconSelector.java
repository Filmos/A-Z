package net.filmos.az.gui.panels;

import javafx.scene.Node;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Polygon;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.elements.DE_Icon;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay_Color;
import net.filmos.az.gui.input.NodeSelector;
import org.kordamp.ikonli.dashicons.Dashicons;

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
        BinaryInputDisplay[] icons = new BinaryInputDisplay[iconsRaw.length];

        for(int i=0;i<iconsRaw.length;i++) {
            DE_Icon icon = new DE_Icon(iconsRaw[i].getDescription(), 40, palette.getContent());
            icons[i] = new BinaryInputDisplay_Color(icon, palette);
        }

        NodeSelector userSelector = new NodeSelector(icons);

        DE_RotatingDisplay pane = new DE_RotatingDisplay(560d, userSelector.getAllNodes());
        pane.setPadding(4);
        root.getChildren().add(pane.getNode());
    }

    @Override
    public Node getNode() {
        return root;
    }
}
