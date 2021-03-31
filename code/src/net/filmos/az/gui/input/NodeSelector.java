package net.filmos.az.gui.input;

import javafx.scene.Node;
import javafx.scene.input.MouseEvent;
import net.filmos.az.gui.base.DisplayElement;

import java.util.List;
import java.util.stream.Collectors;

public class NodeSelector {
    private final List<BinaryInputDisplay> wrappedElements;
    private BinaryInputDisplay selectedElement;

    public NodeSelector(List<BinaryInputDisplay> elements) {
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
    public List<Node> getAllNodes() {
        return wrappedElements.stream().map(DisplayElement::getNode).collect(Collectors.toList());
    }

}
