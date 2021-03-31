package net.filmos.az.gui.elements;

import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.scene.Node;
import javafx.scene.input.ScrollEvent;
import javafx.scene.layout.VBox;
import jfxtras.scene.layout.CircularPane;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.base.DisplayElementGroup;

public class DE_RotatingDisplay extends DisplayElement {
    private final CircularPane root;
    private final DisplayElementGroup allElements;
    private int startingIndex = 0;
    private final int maxElements;
    private int padding;

    public DE_RotatingDisplay(double diameter, DisplayElementGroup elements) {
        allElements = elements;
        maxElements = (int) Math.floor(diameter/20d);

        root = new CircularPane();
        root.setDiameter(diameter);
        root.setChildrenAreCircular(true);

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

        int prefixElements = (int) Math.floor(padding/2d);
        int trueElements = Math.min(allElements.getLength(), maxElements-padding);
        int suffixElements = maxElements-prefixElements-trueElements;

        for(int i=0;i<prefixElements;i++)
            newElements.add(new VBox());
        for(DisplayElement el : allElements.getSubset(startingIndex, trueElements))
            newElements.add(el.getNode());
        for(int i=0;i<suffixElements;i++)
            newElements.add(new VBox());

        root.getChildren().setAll(newElements);
    }


    public void setPadding(int newPadding) {
        padding = newPadding;
        root.setStartAngle(180d/maxElements*(newPadding%2));
        updateNodes();
    }

    @Override
    public Node getNode() {
        return root;
    }
}
