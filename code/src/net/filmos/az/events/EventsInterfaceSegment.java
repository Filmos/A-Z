package net.filmos.az.events;

import javafx.scene.Node;
import net.filmos.az.Hub;
import net.filmos.az.colors.ColorPalette;
import net.filmos.az.gui.base.DisplayElementGroup;
import net.filmos.az.gui.base.InterfaceSegment;
import net.filmos.az.gui.elements.DE_Icon;
import net.filmos.az.gui.elements.DE_RotatingDisplay;
import net.filmos.az.gui.panels.Panel_NewEvent;
import net.filmos.az.storage.InvalidStorableDictException;
import net.filmos.az.storage.StorableDataset;
import net.filmos.az.storage.StorableDict;
import net.filmos.az.storage.Storage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class EventsInterfaceSegment implements InterfaceSegment {
    private EventTimeline timeline;
    private DE_RotatingDisplay eventsDisplay;
    private DisplayElementGroup eventsGroup;
    private Hub hub;

    @Override
    public String getName() {return "event list";}

    @Override
    public Node buildNode(Hub hub) {
        this.hub = hub;

        eventsGroup = new DisplayElementGroup();
        eventsDisplay = new DE_RotatingDisplay(560d, eventsGroup);

        updateEvents();

        return eventsDisplay.getNode();
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
            hub.logWarning(event.getIcon());
            eventsGroup.addElement(new DE_Icon(event.getIcon(), 40, palette.getContent()));
        }
        eventsDisplay.updateNodes();

//        eventsGroup.addElement(new DE_Icon("", 40, palette.getContent()));
    }
}