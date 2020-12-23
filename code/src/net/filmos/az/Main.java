package net.filmos.az;

import javafx.application.Application;
import javafx.stage.Screen;
import javafx.stage.Stage;
import net.filmos.az.gui.StageBuilder;
import net.filmos.az.gui.StageFactory;
import net.filmos.az.logs.LogChannelConsole;

import java.util.Collections;
import java.util.Comparator;

public class Main extends Application {
    private static final Hub app = new Hub();
    private StageFactory stageFactory;

    public static void main(String [] args) {
        app.addLogChannel(new LogChannelConsole(System.out));
        launch(args);
    }

    @Override public void start(Stage stage) {
        stageFactory = new StageFactory(stage);
        Screen thinnestScreen = Collections.min(Screen.getScreens(),
                                                Comparator.comparing(s -> s.getVisualBounds().getWidth()));
        StageBuilder thinStage = stageFactory.createFullscreenStage(thinnestScreen.getVisualBounds());

        app.addUserInterface(thinStage.getScene());

        app.logImportant("Hi");
        app.log("Hello world");
        app.logWarning("Wow!");
        app.logError("No way");
    }

}
