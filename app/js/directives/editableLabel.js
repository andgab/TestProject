/* Directives */

var appD = angular.module('ganttChart', [ 'dateTimeService' ]);

/* <input type="test" gc-focus="focusInput"> */
appD.directive('gcFocus', function($timeout) {
  return {
    restrict : 'A',
    link : function(scope, element, attrs) {
      scope.$watch(attrs.gcFocus, function(value) {
        if (value === true) {
          // console.log('value=',value);
          element[0].focus();
          element[0].select();
        }
      });
    }
  };
});

/* <gc-editable ng-model="value"></gc-editable> */
appD.directive('gcEditable', function() {
          return {
            restrict : 'E',
            require : '^ngModel',
            scope : {
              value : '=ngModel',
              unit : '@'
            },
            template : '<div> \
					<div ng-hide="isEditMode" ng-click="switchToEdit()">{{value}} {{unit}}</div> \
					<input type="text" class="gc-editable-input" ng-show="isEditMode" ng-blur="switchToView()" gc-focus="isEditMode" ng-model="inputValue"> \
				   </div>',
            replace : true,
            link : function(scope, element, attrs) {
              scope.isEditMode = false;

              scope.switchToEdit = function() {
                scope.isEditMode = true;
                scope.inputValue = scope.value;
              };

              function setView() {
                scope.value = scope.inputValue;
                scope.isEditMode = false;
              }

              scope.switchToView = function() {
                setView();
              };

              element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                  scope.$apply(function() {
                    setView();
                  });
                }
              });
            }
          };
        });



appD.directive('gcResizable', function($document) {
  return {
    restrict : 'A',
    require : '^ngModel',
    scope : {
      value : '=ngModel'
    },
    link : function(scope, iElement, iAttrs, ctrl) {
      var startX = 0, x = 0, startPos = 0;
      iElement.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();

        startX = event.screenX;
        startPos = scope.value;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        x = startPos + (event.screenX - startX);
        if (x < 7) {
          x = 7;
        }
        scope.$apply(function() {
          scope.value = x;
        });
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }

    }
  };
});

/* <gc-task-item ng-model="task"></gc-task-item> */
appD.directive('gcTaskItem', function($document) {
  return {
    restrict : 'E',
    require : '^ngModel',
    scope : {
      value : '=ngModel'
    },
    template : '<div class="gantt-event-wrap" style="left:{{value.pos}}px"> \
    	   	<div class="gantt-task-bar" style="width:{{value.duration}}px;"> \
      			<!-- <div class="gantt-resizable-handle gantt-resizable-handle-start" style="float:left"></div> --> \
			      <div class="gantt-move-handle" gc-resizable ng-model="value.pos" style="float:left; width:{{value.duration-7}}px;"></div> \
      			<div class="gantt-resizable-handle gantt-resizable-handle-end" gc-resizable ng-model="value.duration" style="float:right"></div> \
    		</div> \
	  </div>',
    replace : true,
    link : function(scope, iElement, iAttrs, ctrl) {
      var startX = 0, x = 0, startPos = 0;

      /*
       * iElement.on('mousedown', function(event) { // Prevent default
       * dragging of selected content event.preventDefault();
       * 
       * startX = event.screenX; startPos = scope.value.pos;
       * $document.on('mousemove', mousemove); $document.on('mouseup',
       * mouseup); });
       */
      function mousemove(event) {
        x = startPos + (event.screenX - startX);
        if (x < 0) {
          x = 0;
        }
        /*
         * iElement.css({ left: x + 'px' });
         */
        scope.$apply(function() {
          scope.value.pos = x;
        });
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
        /*
         * scope.$apply(function() { scope.pos = x; });
         */
      }
    }
  };
});

appD.directive('gcTime', ['dateTime', function(dateTime) {
  return {
    restrict : 'E',
    require : '^ngModel',
    scope : {
      value : '=ngModel'
    },
    link : function(scope, iElement, iAttrs, ctrl) {
      var days = new Array("S", "M", "T", "W", "T", "F", "S");
      var month = new Array("Jan", "Feb", "Mar", "Apr", "May",
          "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
      var startDate = dateTime.GetStartDate();
      var endDate = new Date("2014-05-04");

      
      var width = 21 * dateTime.daysBetween(startDate, endDate);
  
      console.log("Days "
          + dateTime.daysBetween(startDate, endDate));
  
      scope
          .$watch(
              'value',
              function(newValue, oldValue, scope) {
  
                var htmlDayHeader = '<table class="f table-header-row" cellpadding="0" border="0" cellspacing="0" style="width: '
                    + width
                    + 'px;"> \
    	      <thead> \
           		   <tr>';
  
                var htmlWeekHeader = '<table class="f table-header-row" cellpadding="0" border="0" cellspacing="0" style="width: '
                    + width
                    + 'px;"> \
  		  <thead> \
     					   <tr>';
  
                var date = new Date(startDate.getTime());
                while ((date.getDate() != endDate.getDate())
                    || (date.getMonth() != endDate.getMonth())
                    || (date.getFullYear() != endDate.getFullYear())) {
                  htmlDayHeader += '<td class="table-column-header" style="position: static; text-align: center; width: 20px;"> \
          		      <div style="height:22px; font-size: 85%;">';
                  htmlDayHeader += days[date.getDay()];
                  htmlDayHeader += '</div> \
        			  </td>';
  
                  if (date.getDay() == 0) {
                    htmlWeekHeader += '<td class="table-column-header" style="position: static; text-align: center; width: 146px;"> \
        			   <div style="height:22px; font-size: 85%;">';
                    htmlWeekHeader += date.getDate() + ' '
                        + month[date.getMonth()] + ' '
                        + date.getFullYear();
                    htmlWeekHeader += '</div> \
  			   </td>';
                  }
                  date.setDate(date.getDate() + 1);
                }
  
                htmlDayHeader += '</tr> \
              </thead> \
                    </table>';
  
                htmlWeekHeader += '</tr> \
               </thead> \
                     </table>';
  
                  iElement.html(htmlWeekHeader + htmlDayHeader);
                });
  
      }
    };
  } ]);
























appD
    .directive(
        'myTestDir',
        function() {
          // var viewTemplate = '<button ng-click="click()">Click me</button>
          // Clicked {{clicked}} times';
          return {
            restrict : 'A',
            scope : {
              value : '=ngModel'
            },
            template : '<div ng-click="click()">Click me</div> Clicked {{value}} times',
            compile : function(tElement, tAttre, transclude) {

              // tElement.html(viewTemplate);

              return function(scope, element, attrs) {
                // scope.value = 0;
                scope.click = function() {
                  scope.value++;
                };
              };
            }
          };
        });

appD
    .directive(
        'myEditableTest',
        function() {
          var viewTemplate = '<div ng-hide="isEditMode" ng-click="switchToEdit()">Test:{{value}}</div>';
          var editTemplate = '<input type="text" ng-show="isEditMode" ng-blur="switchToView()" focus-me="isEditMode" ng-model="inputValue">';
          return {
            restrict : 'E',
            require : 'ngModel',
            /*
             * scope: { value: '=ngModel' },
             */
            scope : {},
            replace : true,
            /*
             * controller: function ($scope) { $scope.inputValue = $scope.value;
             * console.log("$scope.value1 " + $scope.value); },
             */
            compile : function(tElement, tAttre, transclude) {
              // var text = tElement.text();

              // var viewElement = angular.element(viewTemplate);
              // viewElement.html(text);

              tElement.html(editTemplate);
              tElement.append(viewTemplate);

              return function(scope, element, attrs) {
                scope.isEditMode = false;
                scope.inputValue = scope.value;
                console.log("scope.value2 " + scope.value);

                scope.switchToEdit = function() {
                  scope.isEditMode = true;
                };

                scope.switchToView = function() {
                  // viewElement.html(scope.inputValue);
                  scope.value = scope.inputValue;
                  scope.isEditMode = false;
                };
              };
            }
          };
        });
