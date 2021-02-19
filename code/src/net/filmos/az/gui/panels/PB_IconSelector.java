package net.filmos.az.gui.panels;

import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.shape.Polygon;
import jfxtras.scene.layout.CircularPane;
import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorGradient;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.DisplayElementIcon;
import org.kordamp.ikonli.dashicons.Dashicons;

public class PB_IconSelector extends PanelBase {
    private final Group root;

    public PB_IconSelector() {
        root = new Group();
        ColorPalette palette = ColorPalette.defaultPalette();
        createBackground(palette);
        createIconList(palette.getContentGradient());
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
    private void createIconList(ColorGradient gradient) {
        CircularPane pane = new CircularPane();
        pane.setTranslateX(45.0);
        Dashicons[] icons = Dashicons.values();
        for(int i=0;i<29;i++) pane.getChildren().add(new DisplayElementIcon(icons[i].getDescription(), "40px", gradient.getColor((float) (Math.sin(i/2f)/3f+0.5f))).getNode());
        root.getChildren().add(pane);
    }

    @Override
    public Node getNode() {
        return root;
    }
}
