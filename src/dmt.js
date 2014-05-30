/*!
 * CibulCalendar v0.2.5 ~ Copyright (c) 2013 Kari Olafsson, http://tech.cibul.net
 * Released under MIT license, http://opensource.org/licenses/mit-license.php
 */

(function () {

  'use strict';

  var hasTouch = 'ontouchstart' in window && !(/hp-tablet/gi).test(navigator.appVersion),
    isWeird = !!(window && window.navigator && window.navigator.userAgent.match(/msie/i)),

  CibulCalendar = function (element, options) {

    var self = this,
      show = function () {
        self.element.style.display = self.options.inline ? 'inline-block' : 'block';
      },
      hide = function () {
        self.element.style.display = 'none';
      },
      disable = function () {
        self.enabled = false;
        addClass(getElementsByClassName(self.element, self.options.classes.main)[0], self.options.classes.disabled);
      },
      enable = function () {
        self.enabled = true;
        removeClass(getElementsByClassName(self.element, self.options.classes.main)[0], self.options.classes.disabled);
      },
      showNext = function () {

        if (!self.enabled) {
          return;
        }

        _incDisplayedMonth();

      },
      showPrevious = function () {

        if (!self.enabled) {
          return;
        }

        _decDisplayedMonth();

      },


      setSelected = function (selected, updateMonth) {

        if (selected) {

          if (typeof selected.begin === 'undefined') {
            selected = { begin: selected, end: selected };
          }

          if (typeof updateMonth === 'undefined') {
            updateMonth = true;
          }


          if (self.options.range) {
            if (selected.begin > selected.end) {
              self.selection = { begin: selected.end, end: selected.begin };
            }
            else if (selected.end > selected.begin) {
              self.selection = selected;
            }
            //
            else if (self.selection.begin && self.selection.end) {
              self.selection = selected;
            }
            else {
              selected = selected.begin || selected.end;
              if (!self.selection.begin || self.selection.begin > selected) {
                self.selection = { begin: selected, end: self.selection.begin };
              }
              else {
                self.selection = { begin: self.selection.begin, end: selected };
              }
            }
          }

          else {
            self.selection = selected;
          }

          if (self.selection && updateMonth) {
            _setDisplayedMonth(new Date(self.selection.begin.getTime()));
          }
          else {
            _renderSelection.call(self, self.selection);
          }

        }
        else {

          self.selection = false;

          _clearSelectionRender();

        }

      },
      _getSelected = function () {

        if (typeof self.selection === 'undefined') {
          self.selection = false;
        }

        return self.selection;

      },
      _getSelectedElements = function () {

        return getElementsByClassName(getElementsByClassName(self.displayedCalendarElement, self.options.classes.body)[0], self.options.classes.selected);

      },


      /*
          Event Listeners
      */
      _applyBehavior = function () {

        // add event listener to first previous button button
        addEvent(getElementsByClassName(self.displayedCalendarElement, self.options.classes.prev).shift(), 'click', function () {
          showPrevious();
        });

        // add event listener to last next month button
        addEvent(getElementsByClassName(self.displayedCalendarElement, self.options.classes.next).pop(), 'click', function () {
          showNext();
        });

        // selection behavior on date elements
        forEach(self.displayedCalendarElement.querySelectorAll('.'+self.options.classes.body + ' li'), function (listItem) {
          _applySelectionBehavior(listItem);
        });

        // selection behavior on month click
        forEach(self.displayedCalendarElement.querySelectorAll('.'+self.options.classes.title), function (listItem) {
          addEvent(listItem, 'click', function (event) {
            _selectMonth(event);
          });
        });

      },
      _selectMonth = function (event) {

        if (!self.enabled) {
          return;
        }

        var dMonth = _getActiveMonth(event.target);

        setSelected({
          begin: new Date(dMonth.getFullYear(), dMonth.getMonth(), 1),
          end: new Date(dMonth.getFullYear(), dMonth.getMonth()+1, 0)
        });

        _renderCalendar();

        if (typeof self.options.onSelect !== 'undefined') {
          self.options.onSelect(_getSelected());
        }

      },
      _applySelectionBehavior = function (listItem) {

        addEvent(listItem, ['touchstart', 'mousedown'], function () {

          if (self.selecting || !self.enabled) {
            return;
          }

          self.selecting = true;

          _beginPreselection(listItem);

        });

        addEvent(listItem, ['mouseover', 'touchmove'], function (event) {

          if (!self.selecting || !self.enabled) {
            return;
          }

          _updatePreselection(_getActualListItem(listItem, event));

        });

        addEvent(listItem, ['mouseup', 'touchend'], function () {

          if (!self.selecting || !self.enabled) {
            return;
          }

          self.selecting = false;

          _completePreselection(listItem);

          if (getElementsByClassName(self.element, self.options.classes.originCalendar).length) {
            self.element.removeChild(getElementsByClassName(self.element, self.options.classes.originCalendar)[0]);
          }

        });
      },
      _preventDefaultBodyMove = function (event) {
        if (event.preventDefault) {
          event.preventDefault();
        }
      },
      _beginPreselection = function (listItem) {

        if (hasTouch) {
          addEvent(document.getElementsByTagName('body')[0],'touchmove', _preventDefaultBodyMove);
        }

        self.currentListItem = listItem;

        self.anchorDate = _getDateFromElement(listItem);

        if (self.options.range) {
          if (!self.preSelection) {
            self.preSelection = { begin: self.anchorDate };
          }
          else {
            self.preSelection = { begin: self.anchorDate, end: self.anchorDate };
          }
        }
        else {
          self.preSelection = self.anchorDate;
        }

        _renderSelection.call(self, self.anchorDate, true);

      },
      _updatePreselection = function (listItem) {

        if (self.currentListItem === listItem) {
          return;
        }

        self.currentListItem = listItem;

        var date = _getDateFromElement(listItem);

        if (self.options.range) {
          if (date < self.anchorDate) {
            self.preSelection = { begin: date, end: self.anchorDate };
          }
          else if (date > self.anchorDate) {
            self.preSelection = { begin: self.anchorDate, end: date };
          }
        }
        else {
          self.preSelection = { begin: date, end: date };
        }

        _switchMonthOnTimer.call(self, listItem, date);

        _renderSelection.call(self, self.preSelection, true);

      },
      _completePreselection = function () {

        if (hasTouch) {
          document.getElementsByTagName('body')[0].removeEventListener('touchmove', _preventDefaultBodyMove, false);
        }

        self.currentListItem = false;

        setSelected(self.preSelection, false);

        _renderSelection.call(self, self.selection);

        self.preSelection = false;

        if (typeof self.options.onSelect !== 'undefined') {
          self.options.onSelect(self.options.range ? self.selection : self.selection.begin);
        }

        _clearHoverTimer();

      },
      _switchMonthOnTimer = function (listItem, date) {

        var toggle = false,
          self = this,
          sameMonth = (_getActiveMonth(listItem).getMonth() === date.getMonth());

        switch (getChildIndex(listItem.parentNode))
        {
          case 0:
            if ((getChildIndex(listItem) === 0) || !sameMonth) {
              toggle = 'prev';
            }
            break;
          case 4:
            if (!sameMonth) {
              toggle = 'next';
            }
            break;
          case 5:
            if ((getChildIndex(listItem) === 6) || !sameMonth) {
              toggle = 'next';
            }
            break;
        }

        if (toggle) {

          if (typeof self.hoverTimer === 'undefined') {
            self.hoverTimer = setTimeout(
              function () {

                if (toggle === 'next') {
                  showNext();
                }
                else if (toggle === 'prev') {
                  showPrevious();
                }

                _clearHoverTimer();

              },
              self.options.switchMonthOnHoverDelay);
          }
        }
        else {

          _clearHoverTimer();

        }

      },
      _clearHoverTimer = function () {

        if (self.hoverTimer) {
          clearTimeout(self.hoverTimer);
        }

        self.hoverTimer = undefined;

      },


      /*
          self.displayedMonth is the first month in display
          Setter, Getter, etc for self.displayedMonth follows
       */
      _incDisplayedMonth = function () {

        var displayedMonth = _getDisplayedMonth();

        displayedMonth.setMonth(displayedMonth.getMonth()+1);

        _setDisplayedMonth(displayedMonth);

      },
      _decDisplayedMonth = function () {

        var displayedMonth = _getDisplayedMonth();

        displayedMonth.setMonth(displayedMonth.getMonth()-1);

        _setDisplayedMonth(displayedMonth);

      },
      _setDisplayedMonth = function (date) {

        self.displayedMonth = date;

        _renderCalendar();

      },
      _getDisplayedMonth = function () {

        if (typeof self.displayedMonth === 'undefined') {
          self.displayedMonth = new Date();
        }

        return self.displayedMonth;

      },

      /*
        Returns full date of date DOM element
       */
      _getDateFromElement = function (liElement) {

        var ulIndex = getChildIndex(liElement.parentNode),
          incMonth = 0,
          dateValue = parseInt(liElement.getElementsByTagName('span')[0].innerHTML, 10),
          displayedMonth = _getActiveMonth(liElement);

        if ((ulIndex === 0) && (dateValue > 10)) {
          incMonth = -1;
        }

        if ((ulIndex >= 4) && (dateValue < 12)) {
          incMonth = 1;
        }

        return new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + incMonth, dateValue);

      },
      /*
        Returns actual month of date DOM element
       */
      _getActiveMonth = function (liElement) {

        return new Date(parseInt(closest(liElement, self.options.classes.month).getAttribute('data-date'), 10));

      },
      /*
        Returns element from touch event coordinates
       */
      _getActualListItem = function (listItem, event) {

        if (typeof event === 'undefined') {
          return listItem;
        }
        if (typeof event.touches === 'undefined') {
          return listItem;
        }

        return elementFromDocumentPoint(event.touches[0].pageX, event.touches[0].pageY).parentNode;

      },


      /*
        Render functions
       */
      _clearSelectionRender = function () {

        if (!self.displayedCalendarElement) {
          return;
        }

        forEach(self.displayedCalendarElement.querySelectorAll('.'+self.options.classes.body + ' .' + self.options.classes.selected), function(listItem) {

          removeClass(listItem, self.options.classes.selected);

        });

      },
      _renderSelection = function (selection, preSelection) {

        var iDate = false,
          i = 0,
          classes,
          self = self || this,
          currentMonth;

        if (!self.displayedCalendarElement) {
          return;
        }

        preSelection = (typeof preSelection === 'undefined') ? false : preSelection;

        forEach(self.displayedCalendarElement.querySelectorAll('.'+self.options.classes.body+' li'), function (listItem) {

          classes = [];

          currentMonth = _getActiveMonth(listItem).getMonth();

          iDate = _getDateFromElement(listItem);

          if (_isWithinRange(iDate, selection)) {
            classes.push(preSelection ? self.options.classes.preselected : self.options.classes.selected);
          }

          if (_isToday(iDate)) {
            classes.push(self.options.classes.today);
          }

          if (currentMonth !== iDate.getMonth()) {
            classes.push(self.options.classes[i++ < 7 ? 'prevMonth' : 'nextMonth']);
          }

          if (self.options.filter) {
            classes = self.options.filter(iDate, classes);
          }

          listItem.className = classes.join(' ');

        });

      },
      _generateCalendarHTML = function (displayedMonth) {

        var i,
          m = displayedMonth.getMonth(),
          render = '',
          template = self.options.template,
          regexp,
          curDate,
          varMonth = 0,
          selected = _getSelected(),
          dayStack,
          classes,
          mSi,
          lastMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + self.options.monthSpan, 1),
          html = '';

        while (displayedMonth < lastMonth) {

          dayStack = _getDayStack(displayedMonth.getMonth(), displayedMonth.getFullYear());

          // grab the template
          render = template;

          // render class names
          render = render.replace('#calendar-body', self.options.classes.body);
          render = render.replace('#calendar-prev-month', self.options.classes.prev);
          render = render.replace('#calendar-next-month', self.options.classes.next);
          render = render.replace('#calendar-title', self.options.classes.title);

          render = render.replace('#calendar-month', self.options.classes.month);
          render = render.replace('#calendar-head', self.options.classes.head);
          render = render.replace('#calendar-month-nav', self.options.classes.navigation);
          render = render.replace('#calendar-week-days', self.options.classes.weekDays);

          // render title
          render = render.replace('#title', self.options.monthNames[self.options.lang][displayedMonth.getMonth()] + ' ' + displayedMonth.getFullYear());

          // render nav icons
          if (m === displayedMonth.getMonth()) {
            render = render.replace('#navprev', self.options.navDomContent.prev);
          }
          else {
            render = render.replace('#navprev', '');
          }
          if ((displayedMonth.getMonth()+1)%12 === lastMonth.getMonth()) {
            render = render.replace('#navnext', self.options.navDomContent.next);
          }
          else {
            render = render.replace('#navnext', '');
          }

          render = render.replace('#date', displayedMonth.getTime());

          // render days of the week
          for (i = 0; i < 7; i++) {

            regexp = new RegExp('#wd' + i);

            render = render.replace(regexp, self.options.weekDays[self.options.lang][(i + self.options.firstDayOfWeek)%7]);

          }

          //render days

          for (i = 0; i < dayStack.length; i++) {

            regexp = new RegExp('#d' + (i > 9 ? '' : '0') + i);

            render = render.replace(regexp, dayStack[i]);

            mSi = parseInt(dayStack[i], 10);

            // add classes for prev and next month days and selected

            classes = [];

            regexp = new RegExp('#cls' + (i>9?'':'0') + i);

            varMonth = 0;

            if ((i < 7) && (mSi > 10)) {

              classes.push(self.options.classes.prevMonth);
              varMonth = -1;

            }
            else if ((i > 27) && (mSi < 13)) {

              classes.push(self.options.classes.nextMonth);
              varMonth = 1;

            }

            curDate = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + varMonth, mSi);

            if (selected && _isWithinRange(curDate, selected)) {
              classes.push(self.options.classes.selected);
            }

            if (_isToday(curDate)) {
              classes.push(self.options.classes.today);
            }

            if (self.options.filter) {
              self.options.filter(curDate, classes);
            }

            render = render.replace(regexp, classes.length ? ' class="' + classes.join(' ') + '"':'');

          }

          html += render;

          // do the incremantal calculations
          displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);

        }

        return html;

      },
      _renderCalendar = function() {

        var displayedMonth = _getDisplayedMonth(),
          eltToDisplay = document.createElement('div');

        if (self.selecting) {

          // ensure selection origin calendar is maintained and hidden if it isn't calendar to be shown. Show it if it is.

          if ((displayedMonth.getMonth() === self.anchorDate.getMonth()) &&
            (displayedMonth.getFullYear() === self.anchorDate.getFullYear()) &&
            (getElementsByClassName(self.element, self.options.classes.originCalendar).length)) {

            self.element.removeChild(getElementsByClassName(self.element, self.options.classes.main)[0]);

            getElementsByClassName(self.element, self.options.classes.originCalendar)[0].setAttribute('style', 'display:block;');
            getElementsByClassName(self.element, self.options.classes.originCalendar)[0].className = self.options.classes.main;

            return;

          }
          else {

            // set origin calendar if does not exist and render current month calendar
            if (!getElementsByClassName(self.element, self.options.classes.originCalendar).length) {
              getElementsByClassName(self.element, self.options.classes.main)[0].setAttribute('style', 'display:none;');
              getElementsByClassName(self.element, self.options.classes.main)[0].className = self.options.classes.originCalendar;
            }
            else {
              self.element.removeChild(getElementsByClassName(self.element, self.options.classes.main)[0]);
            }

          }

        }
        else {

          if (getElementsByClassName(self.element, self.options.classes.main).length) {
            self.element.removeChild(getElementsByClassName(self.element, self.options.classes.main)[0]);
          }

        }

        eltToDisplay.className = self.options.classes.main;
        eltToDisplay.innerHTML = _generateCalendarHTML(displayedMonth);

        self.element.appendChild(eltToDisplay);

        self.displayedCalendarElement = getElementsByClassName(self.element, self.options.classes.main)[0];

        makeUnselectable(self.element);

        _applyBehavior();

      },
      _getDayStack = function (month, year) {

        var calStack = [],
            //start with the last day of the month
            day = new Date(year, month + 1, 0),
            offsetDays,
            i;

        // shove in month days
        i = day.getDate();

        while (i--) {
          calStack.unshift((i+1).toString());
        }

        // every day of the month is now in the stack,
        // shove in days of previous month

        day = new Date(year, month, 1);

        offsetDays = (day.getDay() - self.options.firstDayOfWeek) % 7;
        offsetDays = offsetDays < 0 ? offsetDays + 7 : offsetDays;

        while (offsetDays--) {

          day.setDate(day.getDate()-1);

          calStack.unshift(day.getDate().toString());

        }

        // shove in days of next month
        day = new Date(year, month + 1, 0);

        while (calStack.length < 42) {

          day.setDate(day.getDate()+1);

          calStack.push(day.getDate().toString());

        }

        return calStack;

      },
      _isToday = function (date) {

        if (typeof self.today === 'undefined') {
          self.today = new Date().toDateString();
        }

        return (date.toDateString() === self.today);

      },
      _isWithinRange = function (date, range) {

        var dateString = parseInt(date.getTime(), 10),
            rangeStrings = {
              begin: parseInt((range.begin||range.end||range).getTime(), 10),
              end: parseInt((range.end||range.begin||range).getTime(), 10)
            };

        return ((dateString >= rangeStrings.begin) && (dateString <= rangeStrings.end));

      };


    if (!options) {
      options = {};
    }

    if (!isElement(element)) {
      return;
    }

    extend(self, {
      options: extend({
        range: true,
        lang: 'en',
        enabled: true,
        firstDayOfWeek: 1,
        selected: false,
        filter: false,
        open: false,
        inline: false,
        monthSpan: 1,
        template: '<div class="#calendar-month" data-date="#date"><div class="#calendar-head"><ul class="#calendar-month-nav"><li class="#calendar-prev-month"><span>#navprev</span></li><li class="#calendar-title"><span>#title</span></li><li class="#calendar-next-month"><span>#navnext</span></li></ul><ul class="#calendar-week-days"><li><span>#wd0</span></li><li><span>#wd1</span></li><li><span>#wd2</span></li><li><span>#wd3</span></li><li><span>#wd4</span></li><li><span> #wd5 </span></li><li><span> #wd6 </span></li></ul></div><div class="#calendar-body"><ul><li#cls00><span> #d00 </span></li><li#cls01><span> #d01 </span></li><li#cls02><span> #d02 </span></li><li#cls03><span> #d03 </span></li><li#cls04><span> #d04 </span></li><li#cls05><span> #d05 </span></li><li#cls06><span> #d06 </span></li></ul><ul><li#cls07><span> #d07 </span></li><li#cls08><span> #d08 </span></li><li#cls09><span> #d09 </span></li><li#cls10><span> #d10 </span></li><li#cls11><span> #d11 </span></li><li#cls12><span> #d12 </span></li><li#cls13><span> #d13 </span></li></ul><ul><li#cls14><span> #d14 </span></li><li#cls15><span> #d15 </span></li><li#cls16><span> #d16 </span></li><li#cls17><span> #d17 </span></li><li#cls18><span> #d18 </span></li><li#cls19><span> #d19 </span></li><li#cls20><span> #d20 </span></li></ul><ul><li#cls21><span> #d21 </span></li><li#cls22><span> #d22 </span></li><li#cls23><span> #d23 </span></li><li#cls24><span> #d24 </span></li><li#cls25><span> #d25 </span></li><li#cls26><span> #d26 </span></li><li#cls27><span> #d27 </span></li></ul><ul><li#cls28><span> #d28 </span></li><li#cls29><span> #d29 </span></li><li#cls30><span> #d30 </span></li><li#cls31><span> #d31 </span></li><li#cls32><span> #d32 </span></li><li#cls33><span> #d33 </span></li><li#cls34><span> #d34 </span></li></ul><ul><li#cls35><span> #d35 </span></li><li#cls36><span> #d36 </span></li><li#cls37><span> #d37 </span></li><li#cls38><span> #d38 </span></li><li#cls39><span> #d39 </span></li><li#cls40><span> #d40 </span></li><li#cls41><span> #d41 </span></li></ul></div></div>',
        classes: extend({
          main: 'calendar-main',
          month: 'calendar-month',
          head: 'calendar-head',
          navigation: 'calendar-month-nav',
          title: 'calendar-title',
          prev: 'calendar-prev',
          next: 'calendar-next',
          weekDays: 'calendar-week-days',
          body: 'calendar-body',
          today: 'calendar-today',
          selected: 'calendar-selected',
          preselected: 'calendar-preselected',
          prevMonth: 'calendar-prev-month',
          nextMonth: 'calendar-next-month',
          disabled: 'calendar-disabled',
          originCalendar: 'calendar-origin'
        }, options.classes ? options.classes : {}),
        navDomContent: { prev: '<', next: '>' },
        monthNames: extend({
          en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
          it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
          es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          sv: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
          no: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
          da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
          tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
        }, options.monthNames ? options.monthNames : {}),
        weekDays: extend({
          en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
          es: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
          sv: ['Sön', 'Mån', 'Tid', 'Ons', 'Tor', 'Fre', 'Lör'],
          no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
          da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
          tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']
        }, options.weekDays),
        switchMonthOnHoverDelay: 800
      }, options),
      displayedCalendarElement: false,
      preSelection: false,
      selecting: false,
      element: element
    });


    self.enabled = self.options.enabled;

    setSelected(self.options.selected);

    _renderCalendar();

    /*
      These are what you will see when accessing calendar object
     */

    return {
      show: show,
      hide: hide,
      disable: disable,
      enable: enable,
      showNext: showNext,
      showPrevious: showPrevious,
      options: options,
      getSelected: _getSelected,
      setSelected: setSelected
    };

  },

  /*
    Wrapper function to help setup and behavior of calendar element
   */
  setupCalendar = function () {

    // on field select, need to create element
    // on click elsewhere need to hide it

    var args = Array.prototype.slice.call(arguments, 0),
      element = args.shift(),
      options = args.pop(),
      elementSecond = args.shift(),
      elementThird = args.shift(),
      calCanvas,
      calendar,
      container = undefined,
      dateBegin = undefined,
      dateEnd = undefined;

    function _init () {
      options = extend({
        onSelect: _onSelect,
        separator: ' - ',
        canvasClass: 'calendar-canvas',
        offset: { top: 5, left: 0 }
      }, options ? options : {});

      if (!options.inline) {
        addEvent(dateBegin, 'click', _focus);
        addEvent(dateEnd, 'click', _focus);
        addEvent(document.getElementsByTagName('body')[0], 'click', function (e) {
          if (!calCanvas.contains(e.target)) {
            _blur();
          }
        });
      }
    }
    function _focus () {
      var offsetPos;

      if (!calCanvas) {
        _createCalendar();
      }

      offsetPos = offset(element);
      offsetPos.left += 'px';
      offsetPos.top += element.offsetHeight;
      offsetPos.top += 'px';

      extend(calCanvas.style, offsetPos);

      calCanvas.style.display = 'block';

      element.blur();
    }
    function _blur () {
      if (calCanvas) {
        calCanvas.style.display = 'none';
      }
    }
    function _createCalendar () {

      if (options.inline) {
        calCanvas = element;
        calCanvas.className += ' ' + options.canvasClass;
      }

      else {
        calCanvas = document.createElement('div');
        calCanvas.className = options.canvasClass;

        if (!element.parentNode.style.position) {
          element.parentNode.style.position = 'relative';
        }

        calCanvas.style.position = 'absolute';

        addEvent(calCanvas, 'click', _focus);

        document.body.appendChild(calCanvas);
      }

      return new CibulCalendar(calCanvas, options);

    }
    function _onSelect (newSelection) {


      if (dateEnd) {
        dateBegin.value = _dateToString(newSelection.begin);
        dateEnd.value = newSelection.end ? _dateToString(newSelection.end) : '' ;
      }
      else {
        dateBegin.value = _dateToString(newSelection.begin||newSelection) +
          (newSelection.end && newSelection.begin !== newSelection.end ? options.separator + _dateToString(newSelection.end) : '');
      }

      fireEvent(element, 'change');

      if (calendar.options.inline) {
        return;
      }
      else if (calendar.options.range && !calendar.getSelected().end) {
        return;
      }
      else {
        setTimeout(_blur,200);
      }
    }
    function _dateToString (date) {

      return _fZ(date.getMonth()+1) + '/' + _fZ(date.getDate()) + '/' + date.getFullYear();

    }
    function _fZ (n) {

      return (n > 9 ? '' : '0') + n;

    }


    // Grab the elements
    element = (typeof element === 'string') ? document.querySelector(element) : element;
    elementSecond = (typeof elementSecond === 'string') ? document.querySelector(elementSecond) : elementSecond;
    elementThird = (typeof elementThird === 'string') ? document.querySelector(elementThird) : elementThird;

    if (!element) {
      throw 'Calendar needs a base element to attach to';
    }

    if (options.inline && elementThird) {
      dateBegin = elementSecond;
      dateEnd = elementThird;
    }
    else if (options.inline && elementSecond) {
      dateBegin = elementSecond;
    }
    else if (elementSecond) {
      dateEnd = elementSecond;
      dateBegin = element;
    }
    else {
      dateBegin = element;
    }

    _init();
    calendar = _createCalendar();

    if (!options.open && !options.inline) {
      _blur();
    }
    else if (options.inline) {
      calCanvas.style.display = 'inline-block';
    }

    return calendar;

  },
  /*
    Helper Functions
  */
  extend = function () {
    for (var key, i = 1; i < arguments.length; i++) {
      for (key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  },
  getElementsByClassName = function (node, classname) {
    var a = [],
      re = new RegExp('(^| )'+classname+'( |$)'),
      els = node.getElementsByTagName('*'),
      i,
      j;

    for (i=0, j = els.length; i<j; i++) {
      if (re.test(els[i].className)) {
        a.push(els[i]);
      }
    }
    return a;
  },
  isElement = function(o){
    return (
      typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
      o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string'
    );
  },
  forEach = function (array, action) {
    for (var i = 0; i < array.length; i++) {
      action.apply(this, [array[i]].concat(Array.prototype.splice.call(arguments, 2)));
    }
  },
  addEvent = function (elem, types, eventHandle) {
    if (elem === null || elem === undefined) {
      return;
    }
    if (typeof types === 'string') {
      types = [types];
    }
    forEach(types, function(type) {
      if ( elem.addEventListener ) {
        elem.addEventListener(type, eventHandle, false);
      }
      else if (elem.attachEvent) {
          elem.attachEvent('on' + type, eventHandle);
      }
      else {
          elem['on' + type] = eventHandle;
      }
    });
  },
  fireEvent = function (elem, types) {
    if (elem === null || elem === undefined) {
      return;
    }
    if (typeof types === 'string') {
      types = [types];
    }
    forEach(types, function(type){
      if ('fireEvent' in elem) {
        elem.fireEvent(type);
      }
      else {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, false, true);
        elem.dispatchEvent(evt);
      }
    });
  },
  makeUnselectable = function (node) {
    /* IE < 11 */
    if (isWeird) {
      return;
    }

    if (node.nodeType === 1) {
      node.setAttribute('unselectable', 'on');
    }

    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
  },
  closest = function (elemroot, match) {
    var parent = elemroot.parentNode || elemroot,
        re = new RegExp('(^| )'+match+'( |$)');
    while (parent !== elemroot) {
      if (re.test(parent.className)) {
        return parent;
      }
      elemroot = parent;
      parent = elemroot.parentNode || elemroot;
    }
    return false;
  },
  previousObject = function (elem) {

    elem = elem.previousSibling;

    while (elem && elem.nodeType !== 1) {
      elem = elem.previousSibling;
    }

    return elem;

  },
  getChildIndex = function(child) {

    var i = 0;

    while ((child = previousObject(child)) !== null) {
      i++;
    }

    return i;

  },
  offset = function (element) {
    var body = document.body,
      win = document.defaultView,
      docElem = document.documentElement,
      box = document.createElement('div'),
      isBoxModel,
      clientTop,
      clientLeft,
      scrollTop,
      scrollLeft;

    box.style.paddingLeft = box.style.width = '1px';
    body.appendChild(box);
    isBoxModel = box.offsetWidth === 2;
    body.removeChild(box);
    box = element.getBoundingClientRect();

    clientTop  = docElem.clientTop  || body.clientTop  || 0,
    clientLeft = docElem.clientLeft || body.clientLeft || 0,
    scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
    scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;

    return {
      top : box.top  + scrollTop  - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  },
  hasClass = function (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  },
  addClass = function (element, className) {
    if (!hasClass(element, className)) {
      element.className = element.className + ' ' + className;
    }
  },
  removeClass = function(element, cls) { if (hasClass(element, cls)) { var regex = new RegExp(cls, 'g'); element.className = element.className.replace(regex,''); } },
  elementFromPointIsUsingViewPortCoordinates = function() {
    if (window.pageYOffset > 0) {     // page scrolled down
      return (window.document.elementFromPoint(0, window.pageYOffset + window.innerHeight -1) === null);
    }
    else if (window.pageXOffset > 0) {   // page scrolled to the right
      return (window.document.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) === null);
    }
    return false; // no scrolling, don't care
  },
  elementFromDocumentPoint = function(x,y) {
    if (elementFromPointIsUsingViewPortCoordinates()){
      return window.document.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    }
    else {
      return window.document.elementFromPoint(x,y);
    }
  };

  extend(window, {
    DMT: setupCalendar
  });

})();
