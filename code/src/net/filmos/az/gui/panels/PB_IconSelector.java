package net.filmos.az.gui.panels;

import javafx.scene.Node;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.ScrollEvent;
import javafx.scene.layout.StackPane;
import javafx.scene.shape.Polygon;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.base.DisplayElementGroup;
import net.filmos.az.gui.elements.DE_Icon;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay;
import net.filmos.az.gui.input.BinaryInputDisplay_Color;
import net.filmos.az.gui.input.NodeSelector;
import org.kordamp.ikonli.dashicons.Dashicons;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class PB_IconSelector extends PanelBase {
    private final StackPane root;
    private NodeSelector userSelector;
    private DisplayElementGroup iconGroup;
    private DE_RotatingDisplay pane;

    public PB_IconSelector(ColorPalette palette) {
        root = new StackPane();
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
        iconGroup = new DisplayElementGroup();

        for (Dashicons iconCode : iconsRaw) {
            DE_Icon icon = new DE_Icon(iconCode.getDescription(), 40, palette.getContent());
            iconInput.add(new BinaryInputDisplay_Color(icon, palette));
            iconGroup.addLabeledElement(icon, iconCode.getDescription());
        }

        pane = new DE_RotatingDisplay(560d, iconGroup);
        pane.setPadding(5);
        pane.setAngle(0d);
        root.getChildren().add(pane.getNode());

        addSelectionEvents(iconInput);
        addSearchBar();
    }
    private void addSelectionEvents(List<BinaryInputDisplay> iconInput) {
        Consumer<DisplayElement> onSelected = (DisplayElement el) -> {iconGroup.pinElement(el); pane.updateNodes();};
        Consumer<DisplayElement> onUnselected = (DisplayElement el) -> {iconGroup.unpinElement(el); pane.updateNodes();};
        userSelector = new NodeSelector(iconInput);
        userSelector.addSelectedListener(onSelected);
        userSelector.addUnselectedListener(onUnselected);
        userSelector.selectRandom();
    }
    private void addSearchBar() {
        TextField textField = new TextField();
        textField.setMaxWidth(256.5);
        textField.setTranslateY(-222.5);
        textField.setTranslateX(-17);
        textField.setOnKeyTyped((KeyEvent event) -> {
            iconGroup.setFilter(textField.getText());
            pane.updateNodes();
        });
        root.getChildren().add(textField);
    }
    public String getSelectedIcon() {
        return ((DE_Icon) userSelector.getSelection()).getIconName();
    }

    @Override
    public Node getNode() {
        return root;
    }
}
