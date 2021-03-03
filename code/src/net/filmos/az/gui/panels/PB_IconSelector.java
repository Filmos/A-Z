package net.filmos.az.gui.panels;

import javafx.scene.Node;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Polygon;
import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.DE_Icon;
import net.filmos.az.gui.DE_RotatingSelector;
import org.kordamp.ikonli.dashicons.Dashicons;

public class PB_IconSelector extends PanelBase {
    private final StackPane root;

    public PB_IconSelector() {
        root = new StackPane();
        ColorPalette palette = ColorPalette.defaultPalette();
        createBackground(palette);
        createIconList(palette.getContent());
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
    private void createIconList(Color color) {
        Dashicons[] iconsRaw = Dashicons.values();
        Node[] icons = new Node[iconsRaw.length];
        for(int i=0;i<iconsRaw.length;i++)
            icons[i] = new DE_Icon(iconsRaw[i].getDescription(), 40, color).getNode();

//        Node[] icons = new Node[10];
//        for(int i=0;i<10;i++)
//            icons[i] = new DE_Icon("dashicons-editor-help", (i*3+10), color).getNode();

//        Node[] icons = new Node[10];
//        for(int i=0;i<10;i++)
//            icons[i] = new DE_Icon("dashicons-editor-help", 40, color).getNode();

        Node pane = new DE_RotatingSelector(560d, icons).getNode();
        root.getChildren().add(pane);
    }

    @Override
    public Node getNode() {
        return root;
    }
}
