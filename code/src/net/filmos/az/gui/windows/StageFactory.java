package net.filmos.az.gui.windows;

import javafx.geometry.Rectangle2D;
import javafx.stage.Stage;

public class StageFactory {
    private final StageBuilder rootStage;

    public StageFactory(Stage stage) {
        rootStage = new StageBuilder(stage);
        rootStage.makeInvisible();
        rootStage.activate();
    }

    public StageBuilder createFullscreenStage(Rectangle2D bounds) {
        StageBuilder stage = createSubStage();
        stage.setSize(bounds);
        stage.makeSticky();
        stage.activate();
        return stage;
    }

    private StageBuilder createSubStage() {
        Stage stage = new Stage();
        stage.initOwner(rootStage.getStage());
        return new StageBuilder(stage);
    }
}
