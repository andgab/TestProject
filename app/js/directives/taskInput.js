

taskModule = angular.module('taskInputModule', ['dateTimeService']);

/* <task gc-task-model="task.pos" duration="task.duration"></task> */
taskModule.directive('task', ['$browser', '$sniffer', '$document', 'dateTime', function($browser, $sniffer, $document, dateTime) {
  return {
    restrict: 'E',
    require: '?gcTaskModel',
    template : '<div class="gantt-event-wrap" style="left:0px"> \
                  <div class="gantt-task-bar" style="width:20px;"> \
                    <div class="gantt-move-handle" ng-mousedown="moveTask($event)" style="float:left; width:13px;"></div> \
                    <div class="gantt-resizable-handle gantt-resizable-handle-end" ng-mousedown="changedTaskDuration($event)" style="float:right"></div> \
                  </div> \
                </div>',
    replace : true,
    link: function(scope, element, attr, ctrl) {
      var startX = 0, x = 0, startPos = 0;
      var dElement = angular.element(element.children()[0]);
      var moveElement = angular.element(dElement.children()[0]);
      
      if (ctrl) {
        
        scope.moveTask = function (event) {
          startX = event.screenX;
          startPos = ctrl.$viewValueStartTime;
          
          $document.on('mousemove', mousemoveTask); 
          $document.on('mouseup', mouseupTask); 
        };
      
        function mousemoveTask(event) {
          x = startPos + (event.screenX - startX);
          
          x = snapGridStartTime(x);
          scope.$apply(function() {
            ctrl.$setViewValueStartTime(x);
            element.css({ left: x + 'px' });
          });
        }

        function mouseupTask() {
          $document.unbind('mousemove', mousemoveTask);
          $document.unbind('mouseup', mouseupTask);
        }
        
        
        scope.changedTaskDuration = function (event) {
          startX = event.screenX;
          startPos = ctrl.$viewValueDuration;
          
          $document.on('mousemove', mousemoveTaskDuration); 
          $document.on('mouseup', mouseupTaskDuration); 
        };
        
        
        function mousemoveTaskDuration(event) {
          x = startPos + (event.screenX - startX);

          x = snapGridDuration(x);
          scope.$apply(function() {
            ctrl.$setViewValueDuration(x);
            dElement.css({ width: x + 'px'});
            var moveWidth = x-7;
            moveElement.css({ width: moveWidth + 'px'});
          });
        }

        function mouseupTaskDuration() {
          $document.unbind('mousemove', mousemoveTaskDuration);
          $document.unbind('mouseup', mouseupTaskDuration);
        }
        

        ctrl.$render = function() {
          var xPos = ctrl.$viewValueStartTime;
          var xDuration = ctrl.$viewValueDuration;
          element.css({ left: xPos + 'px' });
          dElement.css({ width: xDuration + 'px' });
          var moveWidth = xDuration-7;
          moveElement.css({ width: moveWidth + 'px'});
        };
        
        
        
        ctrl.$parsersDuration.push(function(value) {
          return (value/21);
        });
        
        ctrl.$formattersDuration.push(function(value) {
          return (value*21);
        });
        
        
        ctrl.$parsersStartTime.push(function(value) {
          // get number of days
          var days = value / 21;
          
          // Get date from start day
          var date = dateTime.getDateFromStartDate(days);
          return dateTime.printDate(date);
        });
        
        
        ctrl.$formattersStartTime.push(function(value) {
          var date = new Date(value);
          
          var days = dateTime.getDaysFromStartDate(date);          
          return days * 21;
        });
        
    
      }
    }
  };
}]);



function noop()
{
};

function snapGridDuration(value)
{
  value = Math.round(value/21);
  if(value < 1) {
    value = 1;
  }
  return (value * 21);  
}

function snapGridStartTime(value)
{
  value = Math.round(value/21);
  if(value < 0) {
    value = 0;
  }
  return (value * 21);  
}





var GcTaskModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate',
 function($scope, $exceptionHandler, $attr, $element, $parse, $animate) {
   this.$viewValueStartTime = Number.NaN;
   this.$modelValueStartTime = Number.NaN;
   this.$viewValueDuration = Number.NaN;
   this.$modelValueDuration = Number.NaN;
   this.$parsersStartTime = [];
   this.$formattersStartTime = [];
   this.$parsersDuration = [];
   this.$formattersDuration = [];
   this.$viewChangeListeners = [];
   this.$name = $attr.name;
  
   var gcTaskModelStartTimeGet = $parse($attr.gcTaskModel),
     gcTaskModelStartTimeSet = gcTaskModelStartTimeGet.assign;
   var gcTaskModelDurationGet = $parse($attr.duration),
   gcTaskModelDurationSet = gcTaskModelDurationGet.assign;
  
   if (!gcTaskModelStartTimeSet) {
     throw minErr('gcTaskModel')('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
         $attr.gcTaskModel, startingTag($element));
   }
   
   if (!gcTaskModelDurationSet) {
     throw minErr('gcTaskModel')('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
         $attr.duration, startingTag($element));
   }
  
   /**
   * @ngdoc method
   * @name gcTaskModel.GcTaskModelController#$render
   *
   * @description
   * Called when the view needs to be updated. It is expected that the user of the ng-model
   * directive will implement this method.
   */
   this.$render = noop;
    

   this.$setViewValueStartTime = function(value) {
     this.$viewValueStartTime = value;
  
     angular.forEach(this.$parsersStartTime, function(fn) {
       value = fn(value);
     });
       
     if (this.$modelValueStartTime !== value) {
       this.$modelValueStartTime = value;
       gcTaskModelStartTimeSet($scope, value);
       angular.forEach(this.$viewChangeListeners, function(listener) {
         try {
           listener();
         } catch(e) {
           $exceptionHandler(e);
         }
       });
     }
   };
   
   this.$setViewValueDuration = function(value) {
     this.$viewValueDuration = value;
  
     angular.forEach(this.$parsersDuration, function(fn) {
       value = fn(value);
     });
       
     if (this.$modelValueDuration !== value) {
       this.$modelValueDuration = value;
       gcTaskModelDurationSet($scope, value);
       angular.forEach(this.$viewChangeListeners, function(listener) {
         try {
           listener();
         } catch(e) {
           $exceptionHandler(e);
         }
       });
     }
   };
      
   // model -> value
   var ctrl = this;
  
   $scope.$watch(function gcTaskModelWatch() {
     var StartTimeValue = gcTaskModelStartTimeGet($scope);
     var DurationValue = gcTaskModelDurationGet($scope);
  
     // if scope model value and ngModel value are out of sync
     if (ctrl.$modelValueStartTime !== StartTimeValue
         || ctrl.$modelValueDuration !== DurationValue) {

       var formattersStartTime = ctrl.$formattersStartTime,
         idxStartTime = formattersStartTime.length;

       ctrl.$modelValueStartTime = StartTimeValue;
       while(idxStartTime--) {
         StartTimeValue = formattersStartTime[idxStartTime](StartTimeValue);
       }
   
       var formattersDuration = ctrl.$formattersDuration,
       idxDuration = formattersDuration.length;
    
       ctrl.$modelValueDuration = DurationValue;
       while(idxDuration--) {
         DurationValue = formattersDuration[idxDuration](DurationValue);
       }
       
       if (ctrl.$viewValueStartTime !== StartTimeValue
           || ctrl.$viewValueDuration !== DurationValue) {
         ctrl.$viewValueStartTime = StartTimeValue;
         ctrl.$viewValueDuration = DurationValue;
         ctrl.$render();
       }
     }

     return StartTimeValue;
   });
 }];



taskModule.directive('gcTaskModel', function() {
  return {
    require: 'gcTaskModel',
    controller: GcTaskModelController,
    link: function(scope, element, attr, ctrls) {
      // notify others, especially parent forms

      //var modelCtrl = ctrls[0];

    }
  };
});



