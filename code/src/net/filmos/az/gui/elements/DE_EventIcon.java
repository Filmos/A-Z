package net.filmos.az.gui.elements;

import javafx.animation.RotateTransition;
import javafx.animation.ScaleTransition;
import javafx.scene.Node;
import javafx.scene.control.Tooltip;
import javafx.scene.layout.Pane;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.util.Duration;
import net.filmos.az.colors.Color;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.events.FutureEvent;
import net.filmos.az.gui.base.DisplayElement;
import org.kordamp.ikonli.javafx.FontIcon;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DE_EventIcon extends DisplayElement {
    private final Pane root;
    private final FutureEvent event;

    public DE_EventIcon(FutureEvent event, int size) {
        this.event = event;
        root = new Pane();

        if(event.getState() == FutureEvent.State.FINISHED) {
            createFinishedIcon(size);
            addTooltip(10);
        }
        else {
            createdFutureIcon(size);
            addTooltip(15);
        }

    }

    private void createFinishedIcon(int size) {
        ColorPalette colorPalette = ColorPalette.defaultPalette();
        DE_Icon icon = new DE_Icon(event.getIcon(), (int) (size*0.7), colorPalette.getContentDisabled());
        root.getChildren().add(icon.getNode());
    }
    private void createdFutureIcon(int size) {
        addIconHalves(size);
        if (event.getNormalizedLoss(LocalDateTime.now()) > 0.7) addBigRotationAnimation();
        else {
            if (event.getNormalizedLoss(LocalDateTime.now().plusMinutes(45)) > 0.3) {
                addSmallRotationAnimation();
                if (event.getNormalizedLoss(LocalDateTime.now().plusHours(6)) > 0.3) addScaleAnimation(0.43);
            } else if (event.getNormalizedLoss(LocalDateTime.now().plusHours(6)) > 0.3) addScaleAnimation(0.25);
        }
    }

    private void addIconHalves(int size) {
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

    private void addTooltip(int fontSize) {
        ColorPalette palette = ColorPalette.defaultPalette();
        final Tooltip tooltip = new Tooltip();
        tooltip.setText(event.getTitle()+"\n"+event.getDeadline().format(DateTimeFormatter.ofPattern("HH:mm dd.MM.yyyy")));
        tooltip.setFont(Font.font("Verdana", FontWeight.BOLD,fontSize));
        tooltip.setShowDelay(Duration.seconds(0));
        tooltip.setHideDelay(Duration.seconds(0));
        tooltip.setStyle("-fx-background-color: "+palette.getBackground().toHexString()+"cc; -fx-text-fill: "+palette.getHeader().toHexString()+"; -fx-padding: 6;");
        Tooltip.install(root, tooltip);
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
