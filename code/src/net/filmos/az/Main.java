package net.filmos.az;

import javafx.application.Application;
import javafx.stage.Screen;
import javafx.stage.Stage;
import net.filmos.az.logs.LogInterfaceSegment;
import net.filmos.az.gui.windows.StageBuilder;
import net.filmos.az.gui.windows.StageFactory;
import net.filmos.az.logs.LogChannelConsole;

import java.util.Collections;
import java.util.Comparator;

public class Main extends Application {
    private static final Hub app = new Hub();

    public static void main(String [] args) {
        app.addLogChannel(new LogChannelConsole(System.out));
        launch(args);
    }

    @Override public void start(Stage stage) {
        initWindow(stage);

        app.addSegment(new LogInterfaceSegment());
        app.test();
    }

    private void initWindow(Stage stage) {
        StageFactory stageFactory = new StageFactory(stage);
        Screen thinnestScreen = Collections.min(Screen.getScreens(),
                Comparator.comparing(s -> s.getVisualBounds().getWidth()));
        StageBuilder thinStage = stageFactory.createFullscreenStage(thinnestScreen.getVisualBounds());

        app.setUserInterface(thinStage.getStage());
    }

}
