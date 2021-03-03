package net.filmos.az.gui;

import javafx.collections.FXCollections;
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

    public DE_RotatingSelector(double diameter, Node... elements) {
        allElements = elements;
        maxElements = (int) Math.floor(elements.length/20d);

        root = new CircularPane();
        root.setDiameter(diameter);
        root.setChildrenAreCircular(true);

        populateElements(elements);
        if(elements.length > maxElements)
            registerScrollEvents();
    }

    private void populateElements(Node... elements) {
        if(elements.length > maxElements) {
            for(int i=0;i<maxElements;i++)
                root.getChildren().add(elements[i]);
        } else {
            for(Node element : elements) root.getChildren().add(element);
            for(int i=elements.length;i<maxElements;i++)
                root.getChildren().add(new VBox());
        }
    }

    private void registerScrollEvents() {
        root.setOnScroll((ScrollEvent event) -> {

            if(event.getDeltaY() > 0) {
                startingIndex = (startingIndex+1)%allElements.length;
                Node nextNode = allElements[(startingIndex+maxElements-1)%allElements.length];

                ObservableList<Node> currentElements = FXCollections.observableArrayList(root.getChildren());
                currentElements.remove(0);
                currentElements.add(nextNode);

                root.getChildren().setAll(currentElements);
            } else {
                startingIndex = (allElements.length+startingIndex-1)%allElements.length;
                Node nextNode = allElements[startingIndex];

                ObservableList<Node> currentElements = FXCollections.observableArrayList(root.getChildren());
                currentElements.remove(currentElements.size()-1);
                currentElements.add(0, nextNode);

                root.getChildren().setAll(currentElements);
            }

        });
    }

    @Override
    public Node getNode() {
        return root;
    }
}
