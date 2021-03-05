package net.filmos.az.gui;

import javafx.collections.FXCollections;
import javafx.collections.ObservableArray;
import javafx.collections.ObservableList;
import javafx.scene.Node;
import javafx.scene.input.ScrollEvent;
import javafx.scene.layout.VBox;
import jfxtras.scene.layout.CircularPane;

public class DE_RotatingSelector extends DisplayElement {
    private final CircularPane root;
    private final Node[] allElements;
    private int startingIndex = 0;
    private final int maxElements;
    private int padding;

    public DE_RotatingSelector(double diameter, Node... elements) {
        allElements = elements;
        maxElements = (int) Math.floor(diameter/20d);

        root = new CircularPane();
        root.setDiameter(diameter);
        root.setChildrenAreCircular(true);

        populateElements();
        if(elements.length > maxElements)
            registerScrollEvents();
    }

    public void setPadding(int newPadding) {
        padding = newPadding;
        root.setStartAngle(180d/maxElements*(newPadding%2));
        populateElements();
    }

    private void populateElements() {
        ObservableList<Node> newElements = FXCollections.observableArrayList(root.getChildren());
        newElements.clear();

        int prefixElements = (int) Math.floor(padding/2d);
        int trueElements = Math.min(allElements.length, maxElements-padding);
        int suffixElements = maxElements-prefixElements-trueElements;

        for(int i=0;i<prefixElements;i++)
            newElements.add(new VBox());
        for(int i=0;i<trueElements;i++)
            newElements.add(allElements[(startingIndex+i)%allElements.length]);
        for(int i=0;i<suffixElements;i++)
            newElements.add(new VBox());

        root.getChildren().setAll(newElements);
    }

    private void registerScrollEvents() {
        root.setOnScroll((ScrollEvent event) -> {
            if(event.getDeltaY() < 0)
                startingIndex = (startingIndex+1)%allElements.length;
            else
                startingIndex = (allElements.length+startingIndex-1)%allElements.length;

            populateElements();
        });
    }

    @Override
    public Node getNode() {
        return root;
    }
}
