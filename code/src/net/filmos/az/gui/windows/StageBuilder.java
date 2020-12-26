package net.filmos.az.gui.windows;

import javafx.geometry.Rectangle2D;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class StageBuilder {
    private final Stage stage;

    public StageBuilder(Stage stage) {
        this.stage = stage;
        stage.setTitle("A-Z");
    }

    public void makeInvisible() {
        stage.initStyle(StageStyle.UTILITY);
        stage.setOpacity(0.);
    }
    public void makeSticky() {
        stage.initStyle(StageStyle.TRANSPARENT);
        setColor(Color.rgb(0, 0, 0, 0.75));
        stage.setAlwaysOnTop(true);
        stage.setResizable(false);
    }

    public void setSize(Rectangle2D bounds) {
        stage.setX(bounds.getMinX());
        stage.setY(bounds.getMinY());

        Group root = new Group();
        Scene scene = new Scene(root, bounds.getWidth(), bounds.getHeight());

        stage.setScene(scene);
    }
    public void setColor(Color color) {
        Scene scene = stage.getScene();
        if(scene != null) scene.setFill(color);
    }

    public void activate() {
        stage.show();
    }

    public Stage getStage() {return stage;}
    public Scene getScene() {return stage.getScene();}
}
