package net.filmos.az.gui.windows;

import javafx.scene.Group;
import javafx.scene.Node;
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
}
