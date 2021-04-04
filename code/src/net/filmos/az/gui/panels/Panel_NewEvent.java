package net.filmos.az.gui.panels;

import javafx.collections.FXCollections;
import javafx.scene.Node;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;
import javafx.scene.layout.StackPane;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.scene.text.TextAlignment;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.events.FutureEvent;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.elements.DE_Text;
import net.filmos.az.gui.elements.DateTimePicker;

public class Panel_NewEvent extends DisplayElement {
    private final StackPane root;
    private final PB_IconSelector iconSelector;

    public Panel_NewEvent(ColorPalette palette) {
        root = new StackPane();
        iconSelector = new PB_IconSelector(palette);
        root.getChildren().add(iconSelector.getNode());
        constructPanel(palette);
    }

    private void constructPanel(ColorPalette palette) {
        addTitle(palette);

        int topPos = -130;
        int posOffset = 70;

        addNameInput(palette, topPos);
        addImportanceInput(palette, topPos+posOffset);
        addDeadlineInput(palette, topPos+posOffset*2);
        addDurationInput(palette, topPos+posOffset*3);
    }
    private void addTitle(ColorPalette palette) {
        DE_Text title = new DE_Text(Font.font("Verdana", FontWeight.BOLD, 32), palette.getHeader());
        title.addText("Add new event");
        title.setTextAlignment(TextAlignment.CENTER);
        title.getNode().setTranslateY(-263);
        root.getChildren().add(title.getNode());
    }
    private void addNameInput(ColorPalette palette, int posY) {
        TextField eventName = new TextField();
        eventName.setMaxWidth(320);
        eventName.setTranslateY(posY+26);
        root.getChildren().add(eventName);

        DE_Text eventNameTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        eventNameTitle.addText("Name");
        eventNameTitle.setMaxWidth(330);
        eventNameTitle.getNode().setTranslateY(posY);
        root.getChildren().add(eventNameTitle.getNode());
    }
    private void addImportanceInput(ColorPalette palette, int posY) {
        ChoiceBox importance = new ChoiceBox(FXCollections.observableArrayList(FutureEvent.Importance.values()));
        importance.setMaxWidth(320);
        importance.setTranslateY(posY+26);
        root.getChildren().add(importance);

        DE_Text importanceTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        importanceTitle.addText("Importance");
        importanceTitle.setMaxWidth(330);
        importanceTitle.getNode().setTranslateY(posY);
        root.getChildren().add(importanceTitle.getNode());
    }
    private void addDeadlineInput(ColorPalette palette, int posY) {
        DateTimePicker deadline = new DateTimePicker();
        deadline.setMaxWidth(320);
        deadline.setTranslateY(posY+26);
        root.getChildren().add(deadline);

        DE_Text deadlineTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        deadlineTitle.addText("Deadline");
        deadlineTitle.setMaxWidth(330);
        deadlineTitle.getNode().setTranslateY(posY);
        root.getChildren().add(deadlineTitle.getNode());
    }
    private void addDurationInput(ColorPalette palette, int posY) {
        TextField duration = new TextField();
        duration.setMaxWidth(320);
        duration.setTranslateY(posY+26);
        root.getChildren().add(duration);

        DE_Text durationTitle = new DE_Text(Font.font("Verdana", 18), palette.getContent());
        durationTitle.addText("Duration");
        durationTitle.setMaxWidth(330);
        durationTitle.getNode().setTranslateY(posY);
        root.getChildren().add(durationTitle.getNode());
    }

    @Override
    public Node getNode() {
        return root;
    }
}
