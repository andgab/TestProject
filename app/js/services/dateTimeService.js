angular.module('dateTimeService', []).factory('dateTime', function() {
      dateTimeFactory = {};
      var startDate = null;

      dateTimeFactory.daysBetween = function(startDate, endDate) {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.floor((treatAsUTC(endDate) - treatAsUTC(startDate))
            / millisecondsPerDay);
      };
      
      
      dateTimeFactory.SetStartDay = function(day) {
        startDate = new Date(day);        
        startDate.setHours(0, 0, 0, 0);
        
        // Get start of week
        var startDay = startDate.getDay();
        if (startDay != 0) {
          var date = startDate.getDate();
          date = date - startDay;
          startDate.setDate(date);
        }        
      };
      
      dateTimeFactory.GetStartDate = function() {
        return new Date(startDate.getTime());
      };
      
      
      dateTimeFactory.GetDateFromStartDate = function(days) {
        var date = new Date(startDate.getTime());   
        
        var dateOfStartDay = date.getDate();
        dateOfStartDay = dateOfStartDay + days;
        date.setDate(dateOfStartDay);
        return date;
      };
      
      dateTimeFactory.GetDaysFromStartDate = function(date) {
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
      
      
      
      
      
      

      function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
      };

      return dateTimeFactory;
    });