package net.filmos.az.gui.elements;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Node;
import javafx.scene.input.ScrollEvent;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import jfxtras.scene.layout.CircularPane;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.base.DisplayElementGroup;

public class DE_LinearDisplay extends DisplayElement {
    private final HBox root;
    private final DisplayElementGroup allElements;
    private int startingIndex = 0;
    private final int maxElements;

    public DE_LinearDisplay(double length, double height, DisplayElementGroup elements) {
        allElements = elements;
        maxElements = (int) Math.floor(length/20d);

        root = new HBox();
        root.setMaxWidth(length);
        root.setMaxHeight(height);
        root.setPadding(new Insets(height/10, height/10, height/10, height/10));
        root.setSpacing(height/15);

        registerScrollEvents();
        updateNodes();
    }


    private void registerScrollEvents() {
        root.setOnScroll((ScrollEvent event) -> {
            if(allElements.getLength() <= maxElements) return;

            if(event.getDeltaY() < 0) startingIndex += 1;
            else startingIndex -= 1;

            updateNodes();
        });
    }


    public void updateNodes() {
        if(allElements.getLength()>0)
            startingIndex = (((startingIndex % allElements.getLength()) + allElements.getLength()) % allElements.getLength());
        populateElements();
    }

    private void populateElements() {
        ObservableList<Node> newElements = FXCollections.observableArrayList(root.getChildren());
        newElements.clear();

        for(DisplayElement el : allElements.getSubset(startingIndex, Math.min(allElements.getLength(), maxElements)))
            newElements.add(el.getNode());

        root.getChildren().setAll(newElements);
    }

    @Override
    public Node getNode() {
        return root;
    }
}
