package net.filmos.az;

import javafx.application.Application;
import javafx.geometry.Rectangle2D;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Screen;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import net.filmos.az.logs.LogChannelConsole;

import java.util.Collections;
import java.util.Comparator;

public class Main extends Application {
    private static final Hub app = new Hub();
    private Stage stageController;

    public static void main(String [] args) {
        app.addLogChannel(new LogChannelConsole(System.out));
        launch(args);
    }

    @Override public void start(Stage stage) {
        turnStageToController(stage);
        Screen thinnestScreen = Collections.min(Screen.getScreens(),
                                                Comparator.comparing(s -> s.getVisualBounds().getWidth()));
        Stage thinStage = createFullscreenStage(thinnestScreen.getVisualBounds());

        app.addUserInterface(thinStage.getScene());

        app.logImportant("Hi");
        app.log("Hello world");
        app.logWarning("Wow!");
        app.logError("No way");
    }

    // TODO: restructure stage creation
    private void turnStageToController(Stage stage) {
        makeStageInvisible(stage);
        activateStage(stage);
        stageController = stage;
    }

    private Stage createFullscreenStage(Rectangle2D bounds) {
        Stage stage = createSubStage();
        setStageSize(stage, bounds);
        makeStageSticky(stage);
        activateStage(stage);
        return stage;
    }
    private Stage createSubStage() {
        Stage stage = new Stage();
        stage.initOwner(stageController);
        return stage;
    }

    private void makeStageInvisible(Stage stage) {
        stage.initStyle(StageStyle.UTILITY);
        stage.setOpacity(0.);
    }
    private void makeStageSticky(Stage stage) {
        stage.initStyle(StageStyle.TRANSPARENT);
        setStageColor(stage, Color.rgb(0, 0, 0, 0.75));
        stage.setAlwaysOnTop(true);
        stage.setResizable(false);
    }

    private void setStageSize(Stage stage, Rectangle2D bounds) {
        stage.setX(bounds.getMinX());
        stage.setY(bounds.getMinY());

        Group root = new Group();
        Scene scene = new Scene(root, bounds.getWidth(), bounds.getHeight());

        stage.setScene(scene);
    }
    private void setStageColor(Stage stage, Color color) {
        Scene scene = stage.getScene();
        if(scene != null) scene.setFill(color);
    }

    private void activateStage(Stage stage) {
        stage.setTitle("A-Z");
        stage.show();
    }
}
