package net.filmos.az.gui.storage;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

//TODO: add tests for StorableDataset
public class StorableDataset {
    private int nextId = 0;
    private Map<String, StorableDict> dataset = new HashMap<>();

    public StorableDict get(String key) {return dataset.get(key);}
    public void put(String key, StorableDict value) {dataset.put(key, value);}
    public String add(StorableDict value) {
        put(idAsString(nextId), value);
        nextId += 1;
        return idAsString(nextId-1);
    }

    public void saveAsFile(String filename) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File("storage/"+filename), this);
    }

    public static String idAsString(int id) {return String.format("%x", id);}

    public int getNextId() {return nextId;}
    public Map<String, StorableDict> getDataset() {return dataset;}
}
