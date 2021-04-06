package net.filmos.az.gui.elements;

import javafx.scene.Node;
import javafx.scene.layout.Pane;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.CycleMethod;
import javafx.scene.paint.LinearGradient;
import javafx.scene.paint.Stop;
import javafx.scene.shape.Rectangle;
import net.filmos.az.colors.Color;
import org.kordamp.ikonli.javafx.FontIcon;

public class DE_EventIcon {
    private final Pane root;

    public DE_EventIcon(String iconName, int size, Color color) {

        root = new Pane();
//        root.getChildren().add(getGradient(size));

        FontIcon icon = new FontIcon();
        icon.setIconSize(size);
        icon.setIconLiteral(iconName);
        icon.setStyle(icon.getStyle()+";-fx-icon-color: #ff00cc");

        icon.setLayoutX(0);
        icon.setLayoutY(size);
        icon.setClip(getGradient(size));
        root.getChildren().add(icon);

//        Rectangle gradient = getGradient(size);
//        gradient.setClip(icon);
//        root.getChildren().add(gradient);
//        root.setTranslateX(size*3);
//        root.setTranslateY(size*3);

//        root.setClip(icon);
    }
    private Rectangle getGradient(int size) {
        Stop[] stops = new Stop[] { new Stop(0, javafx.scene.paint.Color.BLACK), new Stop(1, javafx.scene.paint.Color.RED)};
        LinearGradient lg1 = new LinearGradient(0, 0, 1, 0, true, CycleMethod.NO_CYCLE, stops);

        Rectangle r1 = new Rectangle(0, -size, size/2d, size);
//        r1.setTranslateX(size/4);
        r1.setFill(lg1);

        return r1;
    }

    public Node getNode() {
        return root;
    }
}
