package net.filmos.az.gui.elements;

import javafx.animation.RotateTransition;
import javafx.animation.ScaleTransition;
import javafx.scene.Node;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Rectangle;
import javafx.util.Duration;
import net.filmos.az.colors.Color;
import net.filmos.az.events.FutureEvent;
import net.filmos.az.gui.base.DisplayElement;
import org.kordamp.ikonli.javafx.FontIcon;

import java.time.LocalDateTime;

public class DE_EventIcon extends DisplayElement {
    private final Pane root;
    private final FutureEvent event;

    public DE_EventIcon(FutureEvent event, int size) {
        this.event = event;
        root = new Pane();

        addIcon(size);
        if(event.getNormalizedLoss(LocalDateTime.now())>0.7) addBigRotationAnimation();
        else {
            if (event.getNormalizedLoss(LocalDateTime.now().plusMinutes(45)) > 0.3) {
                addSmallRotationAnimation();
                if (event.getNormalizedLoss(LocalDateTime.now().plusHours(6)) > 0.3) addScaleAnimation(0.43);
            } else if (event.getNormalizedLoss(LocalDateTime.now().plusHours(6)) > 0.3) addScaleAnimation(0.25);
        }
    }
    private void addIcon(int size) {
        FontIcon leftIcon = new FontIcon();
        leftIcon.setIconSize(size);
        leftIcon.setIconLiteral(event.getIcon());
        leftIcon.setStyle(leftIcon.getStyle()+";-fx-fill: linear-gradient("+Color.mapToGradient(event.getColorMarks())+")");

        leftIcon.setLayoutX(0);
        leftIcon.setLayoutY(size);
        leftIcon.setClip(new Rectangle(0, -size, size/1.95, size));
        root.getChildren().add(leftIcon);


        FontIcon rightIcon = new FontIcon();
        rightIcon.setIconSize(size);
        rightIcon.setIconLiteral(event.getIcon());
        rightIcon.setStyle(leftIcon.getStyle()+";-fx-fill: linear-gradient("+Color.mapToGradient(event.getColorMarks())+")");

        rightIcon.setLayoutX(0);
        rightIcon.setLayoutY(size);
        rightIcon.setClip(new Rectangle(size/2d, -size, size/1.95, size));
        root.getChildren().add(rightIcon);
    }
    private void addSmallRotationAnimation() {
        RotateTransition rotateTransition = new RotateTransition();

        rotateTransition.setDuration(Duration.millis(350));
        rotateTransition.setFromAngle(-17);
        rotateTransition.setToAngle(17);

        rotateTransition.setCycleCount(-1);
        rotateTransition.setAutoReverse(true);

        rotateTransition.setNode(root);
        rotateTransition.play();
    }
    private void addBigRotationAnimation() {
        RotateTransition rotateTransition = new RotateTransition();

        rotateTransition.setDuration(Duration.millis(2500));
        rotateTransition.setFromAngle(0);
        rotateTransition.setToAngle(180);

        rotateTransition.setCycleCount(-1);
        rotateTransition.setAutoReverse(true);

        rotateTransition.setNode(root);
        rotateTransition.play();
    }
    private void addScaleAnimation(double strength) {
        ScaleTransition scaleTransition = new ScaleTransition();

        scaleTransition.setDuration(Duration.millis(200/strength));
        scaleTransition.setByY(strength);
        scaleTransition.setByX(strength);

        scaleTransition.setCycleCount(-1);
        scaleTransition.setAutoReverse(true);

        scaleTransition.setNode(root);
        scaleTransition.play();
    }
    public Node getNode() {
        return root;
    }
}
