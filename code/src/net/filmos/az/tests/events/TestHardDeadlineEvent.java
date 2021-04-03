package net.filmos.az.tests.events;

import net.filmos.az.events.FutureEvent;
import net.filmos.az.events.HardDeadlineEvent;
import org.junit.Assert;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.*;

public class TestHardDeadlineEvent {
//    @Test
//    public void eventRetainsInformation() {
//        HardDeadlineEvent event = new HardDeadlineEvent("Th is","is a","test");
//        Date expectedDate = Date.from((new GregorianCalendar(2020, Calendar.FEBRUARY, 14)).toInstant());
//        event.setDeadline(expectedDate, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.HIGH);
//
//        Assert.assertEquals("Th is",event.getTitle());
//        Assert.assertEquals("is a",event.getDescription());
//        Assert.assertEquals("test",event.getIcon());
//
//        Assert.assertEquals(expectedDate,event.getDeadline());
//        Assert.assertEquals(FutureEvent.EstimatedCompletionTime.MEDIUM,event.getEstimatedTime());
//        Assert.assertEquals(FutureEvent.Importance.HIGH,event.getImportance());
//    }
//
//    @Test
//    public void areSortedByImportance() {
//        Date date = new Date((new Date()).getTime() + (1000L * 60 * 60 * 24 * 30));
//
//        HardDeadlineEvent event1 = new HardDeadlineEvent("Event 1","This is a test","Test");
//        event1.setDeadline(date, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.MEDIUM);
//        HardDeadlineEvent event2 = new HardDeadlineEvent("Event 2","This is a test","Test");
//        event2.setDeadline(date, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.LOW);
//        HardDeadlineEvent event3 = new HardDeadlineEvent("Event 3","This is a test","Test");
//        event3.setDeadline(date, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.HIGH);
//
//        List<HardDeadlineEvent> inputOrder = Arrays.asList(event1, event2, event3);
//        List<HardDeadlineEvent> correctOrder = Arrays.asList(event3, event1, event2);
//        Assert.assertEquals(correctOrder, HardDeadlineEvent.sortEvents(inputOrder));
//    }
//
//    @Test
//    public void areSortedByDeadline() {
//        Date date1 = new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 7));
//        Date date2 = new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 14));
//        Date date3 = new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 21));
//
//        HardDeadlineEvent event1 = new HardDeadlineEvent("Event 1","This is a test","Test");
//        event1.setDeadline(date1, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.MEDIUM);
//        HardDeadlineEvent event2 = new HardDeadlineEvent("Event 2","This is a test","Test");
//        event2.setDeadline(date3, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.MEDIUM);
//        HardDeadlineEvent event3 = new HardDeadlineEvent("Event 3","This is a test","Test");
//        event3.setDeadline(date2, FutureEvent.EstimatedCompletionTime.MEDIUM, FutureEvent.Importance.MEDIUM);
//
//        List<HardDeadlineEvent> inputOrder = Arrays.asList(event1, event2, event3);
//        List<HardDeadlineEvent> correctOrder = Arrays.asList(event1, event3, event2);
//        Assert.assertEquals(correctOrder, HardDeadlineEvent.sortEvents(inputOrder));
//    }
}
