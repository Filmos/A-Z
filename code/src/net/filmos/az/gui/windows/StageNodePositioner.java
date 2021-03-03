package net.filmos.az.gui.windows;

import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class StageNodePositioner {
    private final Stage stage;

    public StageNodePositioner(Stage stage) {
        this.stage = stage;
    }

    // TODO: add positions
    public void addNode(Node node) {
        ((Group) stage.getScene().getRoot()).getChildren().add(node);
    }
    public void addNodeCenter(Node node) {
        BorderPane alignmentPane = new BorderPane();
        alignmentPane.setCenter(node);
        alignmentPane.prefHeightProperty().bind(stage.getScene().heightProperty());
        alignmentPane.prefWidthProperty().bind(stage.getScene().widthProperty());
        addNode(alignmentPane);
    }
    public Scene getScene() { return stage.getScene();}
}
