package net.filmos.az.gui.base;

import javafx.scene.Node;
import javafx.util.Pair;
import java.util.ArrayList;
import java.util.List;

public class DisplayElementGroup {
    private ArrayList<Pair<String,DisplayElement>> allElements = new ArrayList<>();
    private ArrayList<DisplayElement> filteredElements = new ArrayList<>();
    private String filter = "";

    public void addElement(DisplayElement element) {addLabeledElement(element, "");}
    public void addLabeledElement(DisplayElement element, String label) {
        allElements.add(new Pair<>(label, element));
        if(matchesFilter(label)) filteredElements.add(element);
    }

    public ArrayList<DisplayElement> getSubset(int startIndex, int length) {
        ArrayList<DisplayElement> subset = new ArrayList<>();
        for(int i=0;i<length;i++)
            subset.add(filteredElements.get((startIndex + i) % getLength()));
        return subset;
    }

    private boolean matchesFilter(String label) {
        return label.contains(filter);
    }
    public void setFilter(String filter) {
        this.filter = filter;
        updateElements();
    }

    private void updateElements() {
        filteredElements = new ArrayList<>();
        for(Pair<String,DisplayElement> el : allElements)
            if(matchesFilter(el.getKey())) filteredElements.add(el.getValue());
    }

    public int getLength() {
        return filteredElements.size();
    }
}
