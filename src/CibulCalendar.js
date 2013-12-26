/*!
 * CibulCalendar v0.2.5 ~ Copyright (c) 2013 Kari Olafsson, http://tech.cibul.net
 * Released under MIT license, http://opensource.org/licenses/mit-license.php
 */

(function () {

  'use strict';

  var hasTouch = 'ontouchstart' in window && !(/hp-tablet/gi).test(navigator.appVersion),

    CibulCalendar = function(element, options) {

      if (!options) options = {};

      if (!isElement(element)) return;

      extend(this, {
        options: extend({
          range: true,
          lang: 'en',
          enabled: true,
          firstDayOfWeek: 1,
          selected: false,
          filter: false,
          open: false,
          monthSpan: 1,
          template: '<div class="calmonth" data-date="#date"><div class="calhead"><ul class="calmonthnav"><li class="calprevmonth"><span>#navprev</span></li><li class="caltitle"><span class="month">#title</span></li><li class="calnextmonth"><span>#navnext</span></li></ul><ul class="calweekdays"><li><span>#wd0</span></li><li><span>#wd1</span></li><li><span>#wd2</span></li><li><span>#wd3</span></li><li><span>#wd4</span></li><li><span>#wd5</span></li><li><span>#wd6</span></li></ul></div><div class="calbody"><ul><li#cls00><span>#d00</span></li><li#cls01><span>#d01</span></li><li#cls02><span>#d02</span></li><li#cls03><span>#d03</span></li><li#cls04><span>#d04</span></li><li#cls05><span>#d05</span></li><li#cls06><span>#d06</span></li></ul><ul><li#cls07><span>#d07</span></li><li#cls08><span>#d08</span></li><li#cls09><span>#d09</span></li><li#cls10><span>#d10</span></li><li#cls11><span>#d11</span></li><li#cls12><span>#d12</span></li><li#cls13><span>#d13</span></li></ul><ul><li#cls14><span>#d14</span></li><li#cls15><span>#d15</span></li><li#cls16><span>#d16</span></li><li#cls17><span>#d17</span></li><li#cls18><span>#d18</span></li><li#cls19><span>#d19</span></li><li#cls20><span>#d20</span></li></ul><ul><li#cls21><span>#d21</span></li><li#cls22><span>#d22</span></li><li#cls23><span>#d23</span></li><li#cls24><span>#d24</span></li><li#cls25><span>#d25</span></li><li#cls26><span>#d26</span></li><li#cls27><span>#d27</span></li></ul><ul><li#cls28><span>#d28</span></li><li#cls29><span>#d29</span></li><li#cls30><span>#d30</span></li><li#cls31><span>#d31</span></li><li#cls32><span>#d32</span></li><li#cls33><span>#d33</span></li><li#cls34><span>#d34</span></li></ul><ul><li#cls35><span>#d35</span></li><li#cls36><span>#d36</span></li><li#cls37><span>#d37</span></li><li#cls38><span>#d38</span></li><li#cls39><span>#d39</span></li><li#cls40><span>#d40</span></li><li#cls41><span>#d41</span></li></ul></div></div>',
          classes: extend({
            calendar: 'ccal',
            navDomPrev: 'calprevmonth',
            navDomNext: 'calnextmonth',
            calendarBody: 'calbody',
            selected: 'selected',
            preSelected: 'preselected',
            today: 'today',
            month: 'month',
            prevMonthDate: 'calprev',
            nextMonthDate: 'calnext',
            disabled: 'disabled',
            originCalendar: 'origincal',
          }, options.classes ? options.classes : {}),
          navDomContent: { prev: '<', next: '>' },
          monthNames: extend({
            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            sv: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
            no: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
            da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
          }, options.monthNames ? options.monthNames : {}),
          weekDays: extend({
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
            es: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            sv: ['Sön', 'Mån', 'Tid', 'Ons', 'Tor', 'Fre', 'Lör'],
            no: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'],
            da: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
          }, options.weekDays),
          switchMonthOnHoverDelay: 800,
        }, options),
        displayedCalendarElement: false,
        preSelection: false,
        selecting: false,
        element: element,
      });

      this.enabled = this.options.enabled;

      this.setSelected(this.options.selected);

      this._renderCalendar();

    };

  CibulCalendar.prototype = {
    disable: function () {
      this.enabled = false;
      addClass(getElementsByClassName(this.element, this.options.classes.calendar)[0], this.options.classes.disabled);
    },
    enable: function () {
      this.enabled = true;
      removeClass(getElementsByClassName(this.element, this.options.classes.calendar)[0], this.options.classes.disabled);
    },
    showNext: function () {

      if (!this.enabled) return;

      this._incDisplayedMonth();

    },
    showPrevious: function () {

      if (!this.enabled) return;

      this._decDisplayedMonth();

    },


    setSelected: function (selected, updateMonth) {

      if (selected) {

        if (typeof selected.begin == 'undefined') selected = { begin: selected, end: selected };

        if (typeof updateMonth == 'undefined') updateMonth = true;


        if (this.options.range) {
          if (selected.begin > selected.end) {
            this.selection = { begin: selected.end, end: selected.begin };
          }
          else if (selected.end > selected.begin) {
            this.selection = selected;
          }
          //
          else if (this.selection.begin && this.selection.end) {
            this.selection = selected;
          }
          else {
            selected = selected.begin || selected.end;
            if (!this.selection.begin || this.selection.begin > selected) {
              this.selection = { begin: selected, end: this.selection.begin };
            }
            else {
              this.selection = { begin: this.selection.begin, end: selected };
            }
          }
        }

        else {
          this.selection = selected;
        }

        if (this.selection && updateMonth) {
          this._setDisplayedMonth(new Date(this.selection.begin.getTime()));
        }
        else {
          this._renderSelection(this.selection);
        }

      }
      else {

        this.selection = false;

        this._clearSelectionRender();

      }

    },
    _getSelected: function () {

      if (typeof this.selection == 'undefined') this.selection = false;

      return this.selection;

    },
    _getSelectedElements: function () {

      return getElementsByClassName(getElementsByClassName(this.displayedCalendarElement, this.options.classes.calendarBody)[0], this.options.classes.selected);

    },


    /*
        Event Listeners
    */
    _applyBehavior: function () {

      var self = this;

      // add event listener to first previous button button
      addEvent(getElementsByClassName(this.displayedCalendarElement, this.options.classes.navDomPrev).shift(), 'click', function(listItem) {
        self.showPrevious();
      });

      // add event listener to last next month button
      addEvent(getElementsByClassName(this.displayedCalendarElement, this.options.classes.navDomNext).pop(), 'click', function(listItem) {
        self.showNext();
      });

      // selection behavior on date elements
      forEach(this.displayedCalendarElement.querySelectorAll('.'+this.options.classes.calendarBody + ' li'), function(listItem) {
        self._applySelectionBehavior(listItem);
      });

      // selection behavior on month click
      forEach(this.displayedCalendarElement.querySelectorAll('.'+this.options.classes.month), function (listItem) {
        addEvent(listItem, 'click', function (event) {
          self._selectMonth(event);
        });
      });

    },
    _selectMonth: function (event) {

      if (!this.enabled) return;

      var dMonth = this._getActiveMonth(event.target);

      this.setSelected({
        begin: new Date(dMonth.getFullYear(), dMonth.getMonth(), 1),
        end: new Date(dMonth.getFullYear(), dMonth.getMonth()+1, 0)
      });

      this._renderCalendar();

      if (typeof this.options.onSelect != 'undefined') this.options.onSelect(this._getSelected());

    },
    _applySelectionBehavior: function (listItem) {

      var self = this;

      addEvent(listItem, ['touchstart', 'mousedown'], function(event) {

        if (self.selecting || !self.enabled) return;

        self.selecting = true;

        self._beginPreselection(listItem);

      });

      addEvent(listItem, ['mouseover', 'touchmove'], function(event) {

        if (!self.selecting || !self.enabled) return;

        self._updatePreselection(self._getActualListItem(listItem, event));

      });

      addEvent(listItem, ['mouseup', 'touchend'], function(event) {

        if (!self.selecting || !self.enabled) return;

        self.selecting = false;

        self._completePreselection(listItem);

        if (getElementsByClassName(self.element, self.options.classes.originCalendar).length) {
          self.element.removeChild(getElementsByClassName(self.element, self.options.classes.originCalendar)[0]);
        }

      });
    },
    _preventDefaultBodyMove: function (event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
    },
    _beginPreselection: function (listItem) {

      if (hasTouch) addEvent(document.getElementsByTagName('body')[0],'touchmove', this._preventDefaultBodyMove);

      this.currentListItem = listItem;

      this.anchorDate = this._getDateFromElement(listItem);

      if (this.options.range) {
        if (!this.preSelection) {
          this.preSelection = { begin: this.anchorDate };
        }
        else {
          this.preSelection = { begin: this.anchorDate, end: this.anchorDate };
        }
      }
      else {
        this.preSelection = this.anchorDate;
      }

      this._renderSelection(this.anchorDate, true);

    },
    _updatePreselection: function (listItem) {

      if (this.currentListItem == listItem) return;

      this.currentListItem = listItem;

      var date = this._getDateFromElement(listItem);

      if (this.options.range) {
        if (date < this.anchorDate) {
          this.preSelection = { begin: date, end: this.anchorDate };
        }
        else if (date > this.anchorDate) {
          this.preSelection = { begin: this.anchorDate, end: date }
        }
      }
      else {
        this.preSelection = { begin: date, end: date };
      }

      this._switchMonthOnTimer(listItem, date);

      this._renderSelection(this.preSelection, true);

    },
    _completePreselection: function (listItem) {

      if (hasTouch) document.getElementsByTagName('body')[0].removeEventListener('touchmove', this._preventDefaultBodyMove, false);

      this.currentListItem = false;

      this.setSelected(this.preSelection, false);

      this._renderSelection(this.selection);

      this.preSelection = false;

      if (typeof this.options.onSelect != 'undefined') this.options.onSelect(this.options.range ? this.selection : this.selection.begin);

      this._clearHoverTimer();

    },
    _switchMonthOnTimer: function (listItem, date) {

      var toggle = false,
        self = this,
        sameMonth = (self._getActiveMonth(listItem).getMonth() == date.getMonth());

      switch (getChildIndex(listItem.parentNode))
      {
        case 0:
          if ((getChildIndex(listItem) == 0) || !sameMonth) toggle = 'prev';
          break;
        case 4:
          if (!sameMonth) toggle = 'next';
          break;
        case 5:
          if ((getChildIndex(listItem) == 6) || !sameMonth) toggle = 'next';
          break;
      };

      if (toggle) {

        if (typeof this.hoverTimer == 'undefined') this.hoverTimer = setTimeout(
          function () {

            if (toggle == 'next') {
              self.showNext();
            }
            else if (toggle == 'prev') {
              self.showPrevious();
            }

            self._clearHoverTimer();

          },
          this.options.switchMonthOnHoverDelay);

      }
      else {

        this._clearHoverTimer();

      }

    },
    _clearHoverTimer: function () {

      if (this.hoverTimer) clearTimeout(this.hoverTimer);

      this.hoverTimer = undefined;

    },


    /*
        this.displayedMonth is the first month in display
        Setter, Getter, etc for this.displayedMonth follows
     */
    _incDisplayedMonth: function () {

      var displayedMonth = this._getDisplayedMonth();

      displayedMonth.setMonth(displayedMonth.getMonth()+1);

      this._setDisplayedMonth(displayedMonth);

    },
    _decDisplayedMonth: function () {

      var displayedMonth = this._getDisplayedMonth();

      displayedMonth.setMonth(displayedMonth.getMonth()-1);

      this._setDisplayedMonth(displayedMonth);

    },
    _setDisplayedMonth: function (date) {

      this.displayedMonth = date;

      this._renderCalendar();

    },
    _getDisplayedMonth: function () {

      if (typeof this.displayedMonth == 'undefined') this.displayedMonth = new Date();

      return this.displayedMonth;

    },

    /*
      Returns full date of date DOM element
     */
    _getDateFromElement: function (liElement) {

      var ulIndex = getChildIndex(liElement.parentNode),
          incMonth = 0,
          dateValue = parseInt(liElement.getElementsByTagName('span')[0].innerHTML, 10),
          displayedMonth = this._getActiveMonth(liElement);

      if ((ulIndex==0) && (dateValue>10)) incMonth = -1;

      if ((ulIndex>=4) && (dateValue<12)) incMonth = 1;

      return new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + incMonth, dateValue);

    },
    /*
      Returns actual month of date DOM element
     */
    _getActiveMonth: function (liElement) {

      return new Date(parseInt(closest(liElement, 'calmonth').getAttribute('data-date'), 10));

    },
    /*
      Returns element from coordinates
     */
    _getActualListItem: function (listItem, event) {

      if (typeof event == 'undefined') return listItem;
      if (typeof event.touches == 'undefined') return listItem;

      return elementFromDocumentPoint(event.touches[0].pageX, event.touches[0].pageY).parentNode

    },


    /*
      Render functions
     */
    _clearSelectionRender: function () {

      var self = this;

      if (!this.displayedCalendarElement) return;

      forEach(this.displayedCalendarElement.querySelectorAll('.'+this.options.classes.calendarBody + ' .' + this.options.classes.selected), function(listItem) {

        removeClass(listItem, self.options.classes.selected);

      });

    },
    _renderSelection: function (selection, preSelection) {

      if (!this.displayedCalendarElement) return;

      var iDate = false,
        i = 0,
        classes,
        self = this,
        currentMonth,
        preSelection = (typeof preSelection == 'undefined') ? false : preSelection;

      forEach(this.displayedCalendarElement.querySelectorAll('.'+this.options.classes.calendarBody+' li'), function (listItem) {

        classes = [];

        currentMonth = self._getActiveMonth(listItem).getMonth();

        iDate = self._getDateFromElement(listItem);

        if (self._isWithinRange(iDate, selection)) classes.push(preSelection ? self.options.classes.preSelected : self.options.classes.selected);

        if (self._isToday(iDate)) classes.push(self.options.classes.today);

        if (currentMonth != iDate.getMonth()) classes.push(self.options.classes[i++ < 7 ? 'prevMonthDate' : 'nextMonthDate']);

        if (self.options.filter) classes = self.options.filter(iDate, classes);

        listItem.className = classes.join(' ');

      });

    },
    _generateCalendarHTML: function (displayedMonth) {

      var i,
        m = displayedMonth.getMonth(),
        render = '',
        template = this.options.template,
        regexp,
        curDate,
        varMonth = 0,
        selected = this._getSelected(),
        dayStack,
        classes,
        mSi,
        lastMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + this.options.monthSpan, 1),
        html = '';

      while (displayedMonth < lastMonth) {

        dayStack = this._getDayStack(displayedMonth.getMonth(), displayedMonth.getFullYear());

        // render title
        render = template.replace('#title', this.options.monthNames[this.options.lang][displayedMonth.getMonth()] + ' ' + displayedMonth.getFullYear());

        // render nav icons
        // render = template.replace('#navprev', this.options.navDomContent.prev).replace('#navnext', this.options.navDomContent.next);
        if (m == displayedMonth.getMonth()) {
          render = render.replace('#navprev', this.options.navDomContent.prev);
        }
        else {
          render = render.replace('#navprev', '');
        }
        if (displayedMonth.getMonth() == lastMonth.getMonth()-1) {
          render = render.replace('#navnext', this.options.navDomContent.next);
        }
        else {
          render = render.replace('#navnext', '');
        }

        render = render.replace('#date', displayedMonth.getTime());

        // render days of the week
        for (i = 0; i < 7; i++) {

          regexp = new RegExp('#wd' + i);

          render = render.replace(regexp, this.options.weekDays[this.options.lang][(i + this.options.firstDayOfWeek)%7]);

        };

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

            classes.push(this.options.classes.prevMonthDate);
            varMonth = -1;

          }
          else if ((i > 27) && (mSi < 13)) {

            classes.push(this.options.classes.nextMonthDate);
            varMonth = 1;

          }

          curDate = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + varMonth, mSi);

          if (selected && this._isWithinRange(curDate, selected)) classes.push(this.options.classes.selected);

          if (this._isToday(curDate)) {
            classes.push(this.options.classes.today);
          }

          if (this.options.filter) this.options.filter(curDate, classes);

          render = render.replace(regexp, classes.length ? ' class="' + classes.join(' ') + '"':'');

        };

        html += render;

        // do the incremantal calculations
        displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);

      }

      return html;

    },
    _renderCalendar: function() {

      var displayedMonth = this._getDisplayedMonth();

      if (this.selecting) {

        // ensure selection origin calendar is maintained and hidden if it isn't calendar to be shown. Show it if it is.

        if ((displayedMonth.getMonth() == this.anchorDate.getMonth())
          && (displayedMonth.getFullYear() == this.anchorDate.getFullYear())
          && (getElementsByClassName(this.element, this.options.classes.originCalendar).length)) {

          this.element.removeChild(getElementsByClassName(this.element, this.options.classes.calendar)[0]);

          getElementsByClassName(this.element, this.options.classes.originCalendar)[0].setAttribute('style', 'display:block;');
          getElementsByClassName(this.element, this.options.classes.originCalendar)[0].className = this.options.classes.calendar;

          return;

        }
        else {

          // set origin calendar if does not exist and render current month calendar
          if (!getElementsByClassName(this.element, this.options.classes.originCalendar).length) {
            getElementsByClassName(this.element, this.options.classes.calendar)[0].setAttribute('style', 'display:none;');
            getElementsByClassName(this.element, this.options.classes.calendar)[0].className = this.options.classes.originCalendar;
          }
          else {
            this.element.removeChild(getElementsByClassName(this.element, this.options.classes.calendar)[0]);
          }

        }

      }
      else {

        if (getElementsByClassName(this.element, this.options.classes.calendar).length) {
          this.element.removeChild(getElementsByClassName(this.element, this.options.classes.calendar)[0]);
        }

      }

      var eltToDisplay = document.createElement('div');
      eltToDisplay.className = this.options.classes.calendar;
      eltToDisplay.innerHTML = this._generateCalendarHTML(displayedMonth);

      this.element.appendChild(eltToDisplay);

      this.displayedCalendarElement = getElementsByClassName(this.element, this.options.classes.calendar)[0];

      makeUnselectable(this.element);

      this._applyBehavior();

    },
    _getDayStack: function (month, year) {

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

      day = new Date (year, month, 1);

      offsetDays = (day.getDay() - this.options.firstDayOfWeek) % 7;
      offsetDays = offsetDays < 0 ? offsetDays+7 : offsetDays;

      while (offsetDays--) {

        day.setDate(day.getDate()-1);

        calStack.unshift(day.getDate().toString());

      };

      // shove in days of next month
      day = new Date(year, month + 1, 0);

      while (calStack.length < 42) {

        day.setDate(day.getDate()+1);

        calStack.push(day.getDate().toString());

      }

      return calStack;

    },
    _isToday: function (date) {

      if (typeof this.today == 'undefined') this.today = new Date().toDateString();

      return (date.toDateString() == this.today);

    },
    _isWithinRange: function (date, range) {

      var dateString = parseInt(date.getTime(), 10),
          rangeStrings = {
            begin: parseInt((range.begin||range.end||range).getTime(), 10),
            end: parseInt((range.end||range.begin||range).getTime(), 10)
          };

      return ((dateString >= rangeStrings.begin) && (dateString <= rangeStrings.end));

    }
  };


  var setCibulCalendar = function (elementId, options) {

    // on field select, need to create element
    // on click elsewhere need to hide it

    var element = document.getElementById(elementId),
      calCanvas,
      calendar,
      inFocus = false,
      _init = function () {
        options = extend({
          onSelect: _onSelect,
          separator: ' - ',
          canvasClass: 'calendar-canvas',
          offset: { top: 5, left: 0 }
        }, options ? options : {});

        addEvent(element, 'click', _focus);
        addEvent(document.getElementsByTagName('body')[0], 'click', function () {
          if (!inFocus) _blur();
          inFocus = false;
        });
      },
      _focus = function () {
        inFocus = true;
        if (!calCanvas) _createCalendar();

        extend(calCanvas.style, {
          // position: 'absolute',
          top: (element.offsetTop + element.offsetHeight + options.offset.top) + 'px',
          left: element.offsetLeft + options.offset.left + 'px'
        });

        calCanvas.style.display = 'block';

        element.blur();
      },
      _blur = function () {
        if (calCanvas) {
          calCanvas.style.display = 'none';
        }
      },
      _createCalendar = function () {

        calCanvas = document.createElement('div');
        calCanvas.className = options.canvasClass;

        if (!element.parentNode.style.position) {
          element.parentNode.style.position = 'relative';
        }

        // calCanvas.style.position = 'absolute';

        addEvent(calCanvas, 'click', _focus);

        element.parentNode.appendChild(calCanvas);

        return new CibulCalendar(calCanvas, options);

      },
      _onSelect = function (newSelection) {

        element.value = _dateToString(newSelection.begin||newSelection) + 
            (newSelection.end && newSelection.begin != newSelection.end ? options.separator + _dateToString(newSelection.end) : '');

        fireEvent(element, 'change');

        if (calendar.options.range && !calendar.selection.end) {
          return;
        }
        else {
          setTimeout(_blur,200);
        }
      },
      _dateToString = function (date) {

        return _fZ(date.getMonth()+1) + '/' + _fZ(date.getDate()) + '/' + date.getFullYear();

      },
      _fZ = function (n) {

        return (n > 9 ? '' : '0') + n;

      };

    _init();
    calendar = _createCalendar();

    if (!calendar.options.open) _blur();

    return calendar;

  },
  /*
    Helper Functions
  */
  extend = function (){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
  },
  getElementsByClassName = function (node, classname) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for (var i=0, j=els.length; i<j; i++) {
      if(re.test(els[i].className))a.push(els[i]);
    }
    return a;
  },
  isElement = function(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  },
  forEach = function (array, action) {
    for (var i = 0; i < array.length; i++) {
      action.apply(this, [array[i]].concat(Array.prototype.splice.call(arguments, 2)));
    }
  },
  addEvent = function(elem, types, eventHandle) {
    if (elem == null || elem == undefined) return;
    if (typeof types == 'string') types = [types];
    forEach(types, function(type) {
      if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false);
      }
      else if ( elem.attachEvent ) {
          elem.attachEvent( "on" + type, eventHandle );
      }
      else {
          elem["on"+type]=eventHandle;
      }
    });
  },
  fireEvent = function(elem, types) {
    if (elem == null || elem == undefined) return;
    if (typeof types == 'string') types = [types];
    forEach(types, function(type){
      if ("fireEvent" in elem) {
        elem.fireEvent(type);
      }
      else {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, false, true);
        elem.dispatchEvent(evt);
      }
    });
  },
  /*
    IE ...
   */
  makeUnselectable = function(node) {
    if (node.nodeType == 1) node.setAttribute("unselectable", "on");

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
      if (re.test(parent.className)) return parent;
      elemroot = parent;
      parent = elemroot.parentNode || elemroot;
    }
    return false;
  },
  previousObject = function (elem) {

    elem = elem.previousSibling;

    while (elem && elem.nodeType != 1)
      elem = elem.previousSibling;

    return elem;

  },
  getChildIndex = function(child) {

    var i = 0;

    while( (child = previousObject(child)) != null ) i++;

    return i;

  },
  hasClass = function(element, cls) { return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1; },
  addClass = function(element, className) { if (!hasClass(element, className)) element.className = element.className + ' ' + className; },
  removeClass = function(element, cls) { if (hasClass(element, cls)) { var regex = new RegExp(cls, 'g'); element.className = element.className.replace(regex,''); } },
  elementFromPointIsUsingViewPortCoordinates = function() {
    if (window.pageYOffset > 0) {     // page scrolled down
      return (window.document.elementFromPoint(0, window.pageYOffset + window.innerHeight -1) == null);
    }
    else if (window.pageXOffset > 0) {   // page scrolled to the right
      return (window.document.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) == null);
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
    CibulCalendar: setCibulCalendar
  });

})();
