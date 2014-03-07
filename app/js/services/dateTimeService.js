angular.module('dateTimeService', []).factory('dateTime', function() {
      dateTimeFactory = {};
      var month = new Array("Jan", "Feb", "Mar", "Apr", "May",
          "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
      var daysStartSunday = new Array("S", "M", "T", "W", "T", "F", "S");
      var daysStartMonday = new Array("M", "T", "W", "T", "F", "S", "S");
      var startDate = null;
      var endDate = null; 
      var mondayStartOfWeek = false;
      
      
      
      dateTimeFactory.setMondayAsStartOfWeek = function (value) {
        mondayStartOfWeek = value;
      };

      dateTimeFactory.daysBetween = function(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.round((treatAsUTC(endDate) - treatAsUTC(startDate))
            / millisecondsPerDay);
      };
      
      
      dateTimeFactory.getDay = function(date) {
        var day = date.getDay();
        if(mondayStartOfWeek)
        {
          day = (day || 7) - 1;
        }
        return day;
      };
      
      
      dateTimeFactory.setStartDay = function(day) {
        startDate = new Date(day);        
        startDate.setHours(0, 0, 0, 0);
        
        // Get start of week
        var startDay = dateTimeFactory.getDay(startDate);
        if (startDay != 0) {
          var date = startDate.getDate();
          date = date - startDay;
          startDate.setDate(date);
        }        
      };
      
      dateTimeFactory.getStartDate = function() {
        return new Date(startDate.getTime());
      };
      
      dateTimeFactory.setEndDate = function(day) {
        endDate = new Date(day);        
        endDate.setHours(23, 59, 59, 999);
        
        // Get last day of week
        var endDay = dateTimeFactory.getDay(endDate);
        if (endDay != 6) {
          var date = endDate.getDate();
          date = date + (6 - endDay);
          endDate.setDate(date);
        }
      };
      
      dateTimeFactory.getEndDate = function() {
        return new Date(endDate.getTime());
      };
      
      
      dateTimeFactory.getDateFromStartDate = function(days) {
        var date = new Date(startDate.getTime());   
        
        var dateOfStartDay = date.getDate();
        dateOfStartDay = dateOfStartDay + days;
        date.setDate(dateOfStartDay);
        return date;
      };
      
      dateTimeFactory.getDaysFromStartDate = function(date) {
        return dateTimeFactory.daysBetween(startDate, date);
      };
      
      

      
      
      dateTimeFactory.printDate = function(d) {
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var rValue = year + "-";
        
        if(month < 10) {
          rValue += "0"; 
        }
        rValue += month + "-";
        if (day < 10) {
          rValue += "0";
        }
        rValue += day;
        return rValue;
      };
      
      
      dateTimeFactory.printMonth = function(m) {
        return month[m];
      };
      
      dateTimeFactory.printDay = function(d) {
        var day = "";
        
        if(mondayStartOfWeek) {
          day = daysStartMonday[dateTimeFactory.getDay(d)];
        }
        else {
          day = daysStartSunday[dateTimeFactory.getDay(d)];
        }
        return day;
      };
      
      
      
      
      
      
      

      function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
      };

      return dateTimeFactory;
    });