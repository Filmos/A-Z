package net.filmos.az.events;

import javafx.scene.Node;
import javafx.scene.control.Tooltip;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.scene.paint.CycleMethod;
import javafx.scene.paint.LinearGradient;
import javafx.scene.paint.Stop;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.util.Duration;
import net.filmos.az.Hub;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.DisplayElementGroup;
import net.filmos.az.gui.base.InterfaceSegment;
import net.filmos.az.gui.elements.DE_EventIcon;
import net.filmos.az.gui.elements.DE_Icon;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.panels.Panel_NewEvent;
import net.filmos.az.storage.InvalidStorableDictException;
import net.filmos.az.storage.StorableDataset;
import net.filmos.az.storage.StorableDict;
import net.filmos.az.storage.Storage;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class EventsInterfaceSegment implements InterfaceSegment {
    private EventTimeline timeline;
    private DE_RotatingDisplay eventsDisplay;
    private DisplayElementGroup eventsGroup;
    private StackPane root;
    private Hub hub;

    @Override
    public String getName() {return "event list";}

    @Override
    public Node buildNode(Hub hub) {
        this.hub = hub;

        eventsGroup = new DisplayElementGroup();
        eventsDisplay = new DE_RotatingDisplay(560d, eventsGroup);

        root = new StackPane();
        root.getChildren().setAll(eventsDisplay.getNode());
        updateEvents();

        return root;
    }

    public void updateEvents() {
        updateEventTimeline();
        updateEventDisplay();
    }
    public void updateEventTimeline() {
        hub.log("Loading events from storage...");
        StorableDataset eventsStorage = Storage.getFromStorage("futureEvents");

        List<FutureEvent> eventsParsed = new ArrayList<>();
        for(Map.Entry<String,StorableDict> event : eventsStorage.entrySet()) {
            try {
                FutureEvent parsedEvent = FutureEvent.fromStorableDict(event.getValue());
                eventsParsed.add(parsedEvent);
            } catch(InvalidStorableDictException e) {
                hub.logError("Had to drop a corrupted event");
            }
        }
        timeline = EventTimeline.fromEventList(eventsParsed);
    }
    public void updateEventDisplay() {
        ColorPalette palette = ColorPalette.defaultPalette();

        eventsGroup.clearGroup();
        for(FutureEvent event : timeline.getOrderedEvents()) {
            DE_EventIcon icon = new DE_EventIcon(event, 40);
            Tooltip tooltip = createTooltip(event.getTitle(), palette);
            Tooltip.install(icon.getNode(), tooltip);
            eventsGroup.addElement(icon);
        }

        DE_Icon newEventIcon = new DE_Icon("dashicons-plus", 40, palette.getContentActive());
        newEventIcon.getNode().setOnMouseClicked((MouseEvent event) -> displayNewEventPanel());
        Tooltip tooltip = createTooltip("Add a new event", palette);
        tooltip.setStyle("-fx-background-color: "+palette.getBackground().toHexString()+"cc; -fx-text-fill: "+palette.getContentActive().toHexString()+"; -fx-padding: 6;");
        Tooltip.install(newEventIcon.getNode(), tooltip);
        eventsGroup.addElement(newEventIcon);

        eventsDisplay.updateNodes();
    }
    private Tooltip createTooltip(String text, ColorPalette palette) {
        final Tooltip tooltip = new Tooltip();
        tooltip.setText(text);
        tooltip.setFont(Font.font("Verdana", FontWeight.BOLD,15));
        tooltip.setShowDelay(Duration.seconds(0));
        tooltip.setHideDelay(Duration.seconds(0));
        tooltip.setStyle("-fx-background-color: "+palette.getBackground().toHexString()+"cc; -fx-text-fill: "+palette.getHeader().toHexString()+"; -fx-padding: 6;");
        return tooltip;
    }

    private void displayNewEventPanel() {
        ColorPalette palette = ColorPalette.defaultPalette();
        Panel_NewEvent panel = new Panel_NewEvent(palette, (FutureEvent event) -> {
            addNewEvent(event);
            hideNewEventPanel();
        });

        root.getChildren().setAll(panel.getNode());
    }
    private void hideNewEventPanel() {
        root.getChildren().setAll(eventsDisplay.getNode());
    }

    private void addNewEvent(FutureEvent event) {
        if(event == null) return;
        hub.log("Adding new event to memory...");

        //TODO: improve exception handling
        try {
            StorableDict storableEvent = event.getStorableDict();
            event.setStorageId(Storage.addToStorage("futureEvents", storableEvent));
        } catch (IOException e) {
            e.printStackTrace();
        }

        updateEvents();
    }
}