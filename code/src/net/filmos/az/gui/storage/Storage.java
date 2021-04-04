package net.filmos.az.gui.storage;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

//TODO: add tests for Storage
public class Storage {
    private static Map<String, StorableDataset> dataCache = new HashMap<>();

    public static StorableDataset getFromStorage(String storageName) {
        StorableDataset returnDataset = dataCache.get(storageName);
        if(returnDataset != null) return returnDataset;

        try {
            ObjectMapper mapper = new ObjectMapper();
            returnDataset = mapper.readValue(new File("storage/"+storageName), StorableDataset.class);
        } catch (IOException e) {
            returnDataset = new StorableDataset();
        }

        dataCache.put(storageName, returnDataset);
        return returnDataset;
    }

    public static String addToStorage(String storageName, StorableDict data) throws IOException {
        StorableDataset dataset = getFromStorage(storageName);
        String id = dataset.add(data);
        dataset.saveAsFile(storageName);
        return id;
    }

    public static void updateStorage(String storageName, String id, StorableDict data) throws IOException {
        StorableDataset dataset = getFromStorage(storageName);
        dataset.put(id, data);
        dataset.saveAsFile(storageName);
    }
}
