package net.filmos.az.gui.panels;

import com.fasterxml.jackson.core.JsonProcessingException;
import javafx.animation.Animation;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.animation.Transition;
import javafx.collections.FXCollections;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.TextAlignment;
import jfxtras.scene.control.LocalDateTimePicker;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.events.FutureEvent;
import net.filmos.az.events.HardDeadlineEvent;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.elements.DE_Text;
import net.filmos.az.gui.elements.DateTimePicker;
import net.filmos.az.gui.storage.InvalidStorableDictException;
import net.filmos.az.gui.storage.StorableDict;
import net.filmos.az.gui.storage.Storage;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;

public class Panel_NewEvent extends DisplayElement {
    private final StackPane root;
    private final PB_IconSelector iconSelector;
    private TextField eventNameInput;
    private ChoiceBox importanceInput;
    private DateTimePicker deadlineInput;
    private TextField durationInput;

    public Panel_NewEvent(ColorPalette palette) {
        root = new StackPane();
        iconSelector = new PB_IconSelector(palette);
        root.getChildren().add(iconSelector.getNode());
        constructPanel(palette);
    }

    private void constructPanel(ColorPalette palette) {
        addTitle(palette);

        int topPos = -140;
        int posOffset = 70;

        addNameInput(palette, topPos);
        addImportanceInput(palette, topPos+posOffset);
        addDeadlineInput(palette, topPos+posOffset*2);
        addDurationInput(palette, topPos+posOffset*3);
        addButtons(topPos+posOffset*4+15);
    }
    private void addTitle(ColorPalette palette) {
        DE_Text title = new DE_Text(Font.font("Verdana", FontWeight.BOLD, 32), palette.getHeader());
        title.addText("Add new event");
        title.setTextAlignment(TextAlignment.CENTER);
        title.getNode().setTranslateY(-263);
        root.getChildren().add(title.getNode());
    }
    private void addNameInput(ColorPalette palette, int posY) {
        eventNameInput = new TextField();
        eventNameInput.setMaxWidth(320);
        eventNameInput.setTranslateY(posY+26);
        root.getChildren().add(eventNameInput);

        DE_Text eventNameTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        eventNameTitle.addText("Name");
        eventNameTitle.setMaxWidth(330);
        eventNameTitle.getNode().setTranslateY(posY);
        root.getChildren().add(eventNameTitle.getNode());
    }
    private void addImportanceInput(ColorPalette palette, int posY) {
        FutureEvent.Importance[] possibleValues = FutureEvent.Importance.values();
        importanceInput = new ChoiceBox(FXCollections.observableArrayList(possibleValues));
        importanceInput.setMaxWidth(320);
        importanceInput.setTranslateY(posY+26);
        importanceInput.setValue(possibleValues[possibleValues.length/2]);
        root.getChildren().add(importanceInput);

        DE_Text importanceTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        importanceTitle.addText("Importance");
        importanceTitle.setMaxWidth(330);
        importanceTitle.getNode().setTranslateY(posY);
        root.getChildren().add(importanceTitle.getNode());
    }
    private void addDeadlineInput(ColorPalette palette, int posY) {
        deadlineInput = new DateTimePicker();
        deadlineInput.setMaxWidth(320);
        deadlineInput.setTranslateY(posY+26);
        deadlineInput.setDateTimeValue(LocalDateTime.now().plusDays(2).withMinute(0).withSecond(0).withNano(0));
        root.getChildren().add(deadlineInput);

        DE_Text deadlineTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        deadlineTitle.addText("Deadline");
        deadlineTitle.setMaxWidth(330);
        deadlineTitle.getNode().setTranslateY(posY);
        root.getChildren().add(deadlineTitle.getNode());
    }
    private void addDurationInput(ColorPalette palette, int posY) {
        durationInput = new TextField();
        durationInput.setMaxWidth(320);
        durationInput.setTranslateY(posY+26);
        durationInput.setText("1:30");
        root.getChildren().add(durationInput);

        DE_Text durationTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        durationTitle.addText("Duration");
        durationTitle.setMaxWidth(330);
        durationTitle.getNode().setTranslateY(posY);
        root.getChildren().add(durationTitle.getNode());
    }
    private void addButtons(int posY) {
        Font font = Font.font("Verdana", 15);

        Button buttonAdd = new Button("Add");
        buttonAdd.setFont(font);
        buttonAdd.setTranslateY(posY);
        buttonAdd.setTranslateX(80);
        buttonAdd.setMaxWidth(90);
        buttonAdd.setOnMouseClicked((MouseEvent event) -> onAddEvent());
        root.getChildren().add(buttonAdd);

        Button buttonCancel = new Button("Cancel");
        buttonCancel.setFont(font);
        buttonCancel.setTranslateY(posY);
        buttonCancel.setTranslateX(-80);
        buttonCancel.setMaxWidth(90);
        buttonCancel.setOnMouseClicked((MouseEvent event) -> closePanel());
        root.getChildren().add(buttonCancel);
    }


    private boolean onAddEvent() {
        boolean allFieldsValid = true;

        String name = eventNameInput.getText();
        if(name.isBlank()) {
            blinkField(eventNameInput);
            allFieldsValid = false;
        }

        FutureEvent.Importance importance = (FutureEvent.Importance) importanceInput.getValue();
        if(importance == null) {
            blinkField(importanceInput);
            allFieldsValid = false;
        }

        LocalDateTime deadline = deadlineInput.getParsedDateTimeValue();
        if(deadline == null) {
            blinkField(deadlineInput);
            allFieldsValid = false;
        }

        Duration duration = parseDuration(durationInput.getText());
        if(duration == null || duration.isZero()) {
            blinkField(durationInput);
            allFieldsValid = false;
        }

        if(!allFieldsValid) return false;

        FutureEvent event = new HardDeadlineEvent(deadline, duration, importance);
        event.setDetails(name, "", iconSelector.getSelectedIcon());

        //TODO: improve exception handling
        try {
            StorableDict storableEvent = event.getStorableDict();
            event.setStorageId(Storage.addToStorage("futureEvents", storableEvent));
        } catch (IOException e) {
            e.printStackTrace();
        }

        closePanel();
        return true;

    }
    public void closePanel() {

    }


    private Duration parseDuration(String input) {
        try {
            return Duration.between(
                    LocalTime.MIN,
                    LocalTime.parse(input)
            );
        } catch (DateTimeParseException e) {}

        try {
            return Duration.between(
                    LocalTime.MIN,
                    LocalTime.parse("0"+input)
            );
        } catch (DateTimeParseException e) {}

        try {
            return Duration.between(
                    LocalTime.MIN,
                    LocalTime.parse("00:"+input)
            );
        } catch (DateTimeParseException e) {}

        try {
            return Duration.between(
                    LocalTime.MIN,
                    LocalTime.parse("00:0"+input)
            );
        } catch (DateTimeParseException e) {}

        return null;
    }
    private void blinkField(Node field) {
        final Animation animation = new Transition() {
            {
                setCycleDuration(javafx.util.Duration.millis(2000));
            }

            protected void interpolate(double frac) {
                String hexColor = String.format("%02x", ((int) (63+192*frac)));
                field.setStyle("-fx-control-inner-background: #ff"+hexColor+hexColor+
                              ";-fx-background-color: #ff"+hexColor+hexColor);
                if(frac == 1.0) field.setStyle("");
            }

        };

        animation.play();
    }

    @Override
    public Node getNode() {
        return root;
    }
}
