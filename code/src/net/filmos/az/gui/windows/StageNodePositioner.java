package net.filmos.az.gui.windows;

import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

import java.util.function.Consumer;

public class StageNodePositioner {
    private final Stage stage;

    public enum Position {
        FULLSCREEN,
        CENTER
    }

    public StageNodePositioner(Stage stage) {
        this.stage = stage;
    }

    // TODO: polish positions
    public void addNode(Node node, Position pos) {
        switch (pos) {
            case FULLSCREEN -> addNodeFullscreen(node);
            case CENTER -> addNodeCenter(node);
        }
    }

    public void addNodeFullscreen(Node node) {
        ((Group) stage.getScene().getRoot()).getChildren().add(node);
    }
    public void addNodeCenter(Node node) {
        BorderPane alignmentPane = new BorderPane();
        alignmentPane.setCenter(node);
        alignmentPane.prefHeightProperty().bind(stage.getScene().heightProperty());
        alignmentPane.prefWidthProperty().bind(stage.getScene().widthProperty());
        addNode(alignmentPane, Position.FULLSCREEN);
    }
    public Scene getScene() { return stage.getScene();}
}
