package net.filmos.az.gui.input;

import javafx.scene.Node;
import javafx.scene.input.MouseEvent;
import net.filmos.az.gui.base.DisplayElement;

import java.util.Arrays;

public class NodeSelector {
    private final BinaryInputDisplay[] wrappedElements;
    private BinaryInputDisplay selectedElement;

    public NodeSelector(BinaryInputDisplay... elements) {
        wrappedElements = elements;
        for(BinaryInputDisplay el : wrappedElements) rigElement(el);
    }

    private void rigElement(BinaryInputDisplay element) {
        element.getNode().setOnMouseClicked((MouseEvent event) -> {
            if(selectedElement != null) selectedElement.deactivate();
            element.activate();
            selectedElement = element;
        });
    }


    public Node getSelection() {
        return selectedElement.getNode();
    }
    public Node[] getAllNodes() {
        return Arrays.stream(wrappedElements).map(DisplayElement::getNode).toArray(Node[]::new);
    }

}
