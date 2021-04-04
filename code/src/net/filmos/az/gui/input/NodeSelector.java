package net.filmos.az.gui.input;

import javafx.scene.Node;
import javafx.scene.input.MouseEvent;
import net.filmos.az.gui.base.DisplayElement;
import net.filmos.az.gui.base.DisplayElementWrapper;
import java.util.concurrent.ThreadLocalRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;

//TODO: add tests for NodeSelector
public class NodeSelector {
    private final List<BinaryInputDisplay> wrappedElements;
    private BinaryInputDisplay selectedElement;
    private List<Consumer<DisplayElement>> unselectListeners = new ArrayList<>();
    private List<Consumer<DisplayElement>> selectListeners = new ArrayList<>();

    public NodeSelector(List<BinaryInputDisplay> elements) {
        wrappedElements = elements;
        for(BinaryInputDisplay el : wrappedElements) rigElement(el);
    }

    private void rigElement(BinaryInputDisplay element) {
        element.getWrappedNode().setOnMouseClicked((MouseEvent event) -> triggerChange(element));
    }
    private void triggerChange(BinaryInputDisplay element) {
        if(selectedElement == element) return;
        triggerDeactivation(selectedElement);
        triggerActivation(element);
    }
    private void triggerDeactivation(BinaryInputDisplay element) {
        if(element == null) return;
        element.deactivate();
        for(Consumer<DisplayElement> listener : unselectListeners)
            listener.accept(element.getDisplayElement());
    }
    private void triggerActivation(BinaryInputDisplay element) {
        selectedElement = element;
        element.activate();
        for(Consumer<DisplayElement> listener : selectListeners)
            listener.accept(element.getDisplayElement());
    }

    public void addUnselectedListener(Consumer<DisplayElement> listener) {
        unselectListeners.add(listener);
    }
    public void addSelectedListener(Consumer<DisplayElement> listener) {
        selectListeners.add(listener);
    }


    public void selectRandom() {
        int randomNum = ThreadLocalRandom.current().nextInt(0, wrappedElements.size());
        triggerChange(wrappedElements.get(randomNum));
    }
    public DisplayElement getSelection() {
        return selectedElement.getDisplayElement();
    }
    public List<Node> getAllNodes() {
        return wrappedElements.stream().map(DisplayElementWrapper::getWrappedNode).collect(Collectors.toList());
    }

}
