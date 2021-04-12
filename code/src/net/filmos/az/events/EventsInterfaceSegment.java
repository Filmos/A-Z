package net.filmos.az.events;

import javafx.geometry.Pos;
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
import net.filmos.az.gui.elements.DE_LinearDisplay;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.panels.Panel_NewEvent;
import net.filmos.az.storage.InvalidStorableDictException;
import net.filmos.az.storage.StorableDataset;
import net.filmos.az.storage.StorableDict;
import net.filmos.az.storage.Storage;

import java.io.IOException;
import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

public class EventsInterfaceSegment implements InterfaceSegment {
    private EventTimeline timeline;
    private ArrayList<FutureEvent> finishedEvents;
    private DE_RotatingDisplay eventsDisplay;
    private DisplayElementGroup eventsGroup;
    private DE_LinearDisplay finishedEventsDisplay;
    private DisplayElementGroup finishedEventsGroup;
    private StackPane root;
    private Hub hub;

    @Override
    public String getName() {return "event list";}

    @Override
    public Node buildNode(Hub hub) {
        this.hub = hub;

        eventsGroup = new DisplayElementGroup();
        finishedEventsGroup = new DisplayElementGroup();
        eventsDisplay = new DE_RotatingDisplay(560d, eventsGroup);
        finishedEventsDisplay = new DE_LinearDisplay(1080d, 8d, finishedEventsGroup);

        root = new StackPane();
        root.getChildren().setAll(eventsDisplay.getNode(), finishedEventsDisplay.getNode());
        StackPane.setAlignment(finishedEventsDisplay.getNode(), Pos.BOTTOM_CENTER);
        hub.log("Loading events from storage...");
        updateEvents();

        return root;
    }

    public void updateEvents() {
        updateEventTimeline();
        updateEventDisplay();
    }
    public void updateEventTimeline() {
        StorableDataset eventsStorage = Storage.getFromStorage("futureEvents");


        List<FutureEvent> eventsParsed = new ArrayList<>();
        finishedEvents = new ArrayList<>();
        for(Map.Entry<String,StorableDict> event : eventsStorage.entrySet()) {
            try {
                FutureEvent parsedEvent = FutureEvent.fromStorableDict(event.getValue(), event.getKey());
                if(parsedEvent.getState() == FutureEvent.State.FINISHED) finishedEvents.add(parsedEvent);
                else eventsParsed.add(parsedEvent);
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
            eventsGroup.addElement(icon);
            icon.getNode().setOnMouseClicked((MouseEvent mouseEvent) -> {
                hub.log("Marked an event as not done");
                changeEventState(event, FutureEvent.State.FINISHED);
            });
        }

        finishedEventsGroup.clearGroup();
        finishedEvents.sort(Comparator.comparing(FutureEvent::getDeadline).reversed());
        for(FutureEvent event : finishedEvents) {
            DE_EventIcon icon = new DE_EventIcon(event, 40);
            finishedEventsGroup.addElement(icon);
            icon.getNode().setOnMouseClicked((MouseEvent mouseEvent) -> {
                hub.log("Marked an event as done");
                changeEventState(event, FutureEvent.State.FUTURE);
            });
        }

        DE_Icon newEventIcon = new DE_Icon("dashicons-plus", 40, palette.getContentActive());
        newEventIcon.getNode().setOnMouseClicked((MouseEvent event) -> displayNewEventPanel());
        Tooltip tooltip = createTooltip("Add a new event", palette);
        tooltip.setStyle("-fx-background-color: "+palette.getBackground().toHexString()+"cc; -fx-text-fill: "+palette.getContentActive().toHexString()+"; -fx-padding: 6;");
        Tooltip.install(newEventIcon.getNode(), tooltip);
        eventsGroup.addElement(newEventIcon);

        eventsDisplay.updateNodes();
        finishedEventsDisplay.updateNodes();
    }
    private void changeEventState(FutureEvent event, FutureEvent.State state) {
        event.setState(state);
        try {
            Storage.updateStorage("futureEvents", event.getStorageId(), event.getStorableDict());
        } catch (IOException e) {
            e.printStackTrace();
            hub.logError("Couldn't update event in storage");
        }
        updateEvents();
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

        root.getChildren().setAll(panel.getNode(), finishedEventsDisplay.getNode());
    }
    private void hideNewEventPanel() {
        root.getChildren().setAll(eventsDisplay.getNode(), finishedEventsDisplay.getNode());
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