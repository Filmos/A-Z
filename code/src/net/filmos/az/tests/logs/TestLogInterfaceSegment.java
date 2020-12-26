package net.filmos.az.tests.logs;


import javafx.application.Platform;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import net.filmos.az.Hub;
import net.filmos.az.colors.Color;
import net.filmos.az.gui.DisplayElementText;
import net.filmos.az.logs.LogInterfaceSegment;
import org.junit.Assert;
import org.junit.Test;
import org.testfx.framework.junit.ApplicationTest;
import org.testfx.matcher.control.TextMatchers;

import java.util.Optional;

public class TestLogInterfaceSegment extends ApplicationTest {
    private Hub hub;

    @Override
    public void start(Stage stage) {
        stage.setScene(new Scene(new Group(), 100, 100));
        stage.show();

        hub = new Hub();
        hub.setUserInterface(stage);
        hub.addSegment(new LogInterfaceSegment());
    }

    @Test
    public void textIsDisplayed() {
        Platform.runLater(() -> {
            hub.log("This");
            hub.logImportant("is");
            hub.logWarning("a");
            hub.logError("test");

            lookup(TextMatchers.hasText("This")).queryText();
            lookup(TextMatchers.hasText("is")).queryText();
            lookup(TextMatchers.hasText("a")).queryText();
            lookup(TextMatchers.hasText("test")).queryText();
        });
    }

}