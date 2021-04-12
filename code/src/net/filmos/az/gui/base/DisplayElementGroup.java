package net.filmos.az.gui.base;

import javafx.scene.Node;
import javafx.util.Pair;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

//TODO: add tests for DisplayElementGroup
public class DisplayElementGroup {
    private ArrayList<Pair<String,DisplayElement>> allElements = new ArrayList<>();
    private ArrayList<DisplayElement> filteredElements = new ArrayList<>();
    private ArrayList<DisplayElement> pinnedElements = new ArrayList<>();
    private String filter = "";

    public void addElement(DisplayElement element) {addLabeledElement(element, "");}
    public void addLabeledElement(DisplayElement element, String label) {
        allElements.add(new Pair<>(label, element));
        if(matchesFilter(label)) filteredElements.add(element);
    }


    public ArrayList<DisplayElement> getSubset(int startIndex, int length) {
        if(length <= 0 || getLength() <= 0) return new ArrayList<>();

        ArrayList<DisplayElement> subset = new ArrayList<>();
        for(int i=0;i<Math.min(length,pinnedElements.size());i++)
            subset.add(pinnedElements.get(i));
        for(int i=0;i<length-pinnedElements.size();i++)
            subset.add(filteredElements.get((startIndex + i) % getLength()));
        return subset;
    }

    private void updateElements() {
        HashMap<Integer,Boolean> pinnedMap = new HashMap<>();
        for(DisplayElement el : pinnedElements)
            pinnedMap.put(el.getID(), true);

        filteredElements = new ArrayList<>();
        for(Pair<String,DisplayElement> el : allElements)
            if(matchesFilter(el.getKey())
            && pinnedMap.get(el.getValue().getID()) == null)
                filteredElements.add(el.getValue());
    }


    private boolean matchesFilter(String label) {
        return label.contains(filter);
    }
    public void setFilter(String filter) {
        this.filter = filter;
        updateElements();
    }

    public void pinElement(DisplayElement element) {
        for(DisplayElement el : pinnedElements)
            if(el.getID() == element.getID()) return;
        pinnedElements.add(element);
        updateElements();
    }
    public void unpinElement(DisplayElement element) {
        for(int i=0;i<pinnedElements.size();i++) {
            DisplayElement el = pinnedElements.get(i);
            if(el.getID() != element.getID()) continue;

            pinnedElements.remove(i);
            updateElements();
            break;
        }
    }

    public int getLength() {
        return filteredElements.size();
    }

    public void clearGroup() {
        allElements = new ArrayList<>();
        filteredElements = new ArrayList<>();
        pinnedElements = new ArrayList<>();
    }
}
