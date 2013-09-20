/*!
 * CibulCalendar v0.2.5 ~ Copyright (c) 2013 Kari Olafsson, http://tech.cibul.net
 * Released under MIT license, http://opensource.org/licenses/mit-license.php
 */

(function(){

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
          template: '<div class="calhead"><ul class="calmonthnav"><li class="calprevmonth"><span>#navprev</span></li><li class="calmonth"><span class="month">#title</span></li><li class="calnextmonth"><span>#navnext</span></li></ul><ul class="calweekdays"><li><span>#wd0</span></li><li><span>#wd1</span></li><li><span>#wd2</span></li><li><span>#wd3</span></li><li><span>#wd4</span></li><li><span>#wd5</span></li><li><span>#wd6</span></li></ul></div><div class="calbody"><ul><li#cls00><span>#d00</span></li><li#cls01><span>#d01</span></li><li#cls02><span>#d02</span></li><li#cls03><span>#d03</span></li><li#cls04><span>#d04</span></li><li#cls05><span>#d05</span></li><li#cls06><span>#d06</span></li></ul><ul><li#cls07><span>#d07</span></li><li#cls08><span>#d08</span></li><li#cls09><span>#d09</span></li><li#cls10><span>#d10</span></li><li#cls11><span>#d11</span></li><li#cls12><span>#d12</span></li><li#cls13><span>#d13</span></li></ul><ul><li#cls14><span>#d14</span></li><li#cls15><span>#d15</span></li><li#cls16><span>#d16</span></li><li#cls17><span>#d17</span></li><li#cls18><span>#d18</span></li><li#cls19><span>#d19</span></li><li#cls20><span>#d20</span></li></ul><ul><li#cls21><span>#d21</span></li><li#cls22><span>#d22</span></li><li#cls23><span>#d23</span></li><li#cls24><span>#d24</span></li><li#cls25><span>#d25</span></li><li#cls26><span>#d26</span></li><li#cls27><span>#d27</span></li></ul><ul><li#cls28><span>#d28</span></li><li#cls29><span>#d29</span></li><li#cls30><span>#d30</span></li><li#cls31><span>#d31</span></li><li#cls32><span>#d32</span></li><li#cls33><span>#d33</span></li><li#cls34><span>#d34</span></li></ul><ul><li#cls35><span>#d35</span></li><li#cls36><span>#d36</span></li><li#cls37><span>#d37</span></li><li#cls38><span>#d38</span></li><li#cls39><span>#d39</span></li><li#cls40><span>#d40</span></li><li#cls41><span>#d41</span></li></ul></div>',
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
          }, options.classes?options.classes:{}),
          navDomContent: { prev: '<', next: '>'},
          monthNames: extend({
            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
            es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Augosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	    sv: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
	    no: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
	    da: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
          }, options.monthNames?options.monthNames:{}),
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
    disable: function() {
      this.enabled = false;
      addClass(getElementsByClassName(this.element, this.options.classes.calendar)[0], this.options.classes.disabled);
    },
    enable: function() {
      this.enabled = true;
      removeClass(getElementsByClassName(this.element, this.options.classes.calendar)[0], this.options.classes.disabled);
    },
    showNext: function() {

      if (!this.enabled) return;

      this._incDisplayedMonth();

    },
    showPrevious: function() {

      if (!this.enabled) return;

      this._decDisplayedMonth();

    },
    setSelected: function(selected, updateMonth) {

      if (selected) {

        if (typeof selected.begin == 'undefined') selected = { begin: selected, end: selected };
        
        if (typeof updateMonth == 'undefined') updateMonth = true;

        this.selection = (selected.begin > selected.end)?{ begin: selected.end, end: selected.begin }:selected;

        if (this.selection && updateMonth) { 
          this._setDisplayedMonth(new Date(this.selection.begin.getTime()));
        } else {
          this._renderSelection(this.selection);  
        }

      } else {

        this.selection = false;

        this._clearSelectionRender();

      }

    },
    _getSelected: function() {

      if (typeof this.selection == 'undefined') this.selection = false;

      return this.selection;

    },
    _getSelectedElements: function() {

      return getElementsByClassName(getElementsByClassName(this.displayedCalendarElement, this.options.classes.calendarBody)[0], this.options.classes.selected);

    },
    _applyBehavior: function() {

      var self = this;

      // show previous calendar on show previous

      addEvent(getElementsByClassName(this.displayedCalendarElement, this.options.classes.navDomPrev)[0], 'click', function(listItem) {
        self.showPrevious();
      });

      addEvent(getElementsByClassName(this.displayedCalendarElement, this.options.classes.navDomNext)[0], 'click', function(listItem) {
        self.showNext();
      });

      // selection behavior on date elements
      forEach(getElementsByClassName(this.displayedCalendarElement, this.options.classes.calendarBody)[0].getElementsByTagName('li'), function(listItem){
        self._applySelectionBehavior(listItem);
      });

      // selection behavior on month click
      addEvent(getElementsByClassName(this.displayedCalendarElement, this.options.classes.month)[0], 'click', function(){
        self._selectMonth();
      });
      
    },
    _selectMonth: function(){

      if (!this.enabled) return;

      var dMonth = this._getDisplayedMonth();

      this.setSelected({begin: new Date(dMonth.getFullYear(), dMonth.getMonth(), 1), end: new Date(dMonth.getFullYear(), dMonth.getMonth()+1, 0)});

      this._renderCalendar();

      if (typeof this.options.onSelect != 'undefined') this.options.onSelect(this.selection);

    },
    _applySelectionBehavior: function(listItem) {

      var self = this;

      addEvent(listItem, ['touchstart', 'mousedown'], function(event){

        if (self.selecting || !self.enabled) return;

        self.selecting = true;

        self._beginPreselection(listItem);

      });

      addEvent(listItem, ['mouseover', 'touchmove'], function(event) {

        if (!self.selecting || !self.enabled) return; 
          
        self._updatePreselection(self._getActualListItem(listItem, event));

      });

      addEvent(listItem, ['mouseup', 'touchend'], function(event){

        if (!self.selecting || !self.enabled) return;

        self.selecting = false;

        self._completePreselection(listItem);

        if (getElementsByClassName(self.element, self.options.classes.originCalendar).length) self.element.removeChild(getElementsByClassName(self.element, self.options.classes.originCalendar)[0]);

      });
    },
    _preventDefaultBodyMove: function(event) {
      if (event.preventDefault) event.preventDefault();
    },
    _beginPreselection: function(listItem) {

      if (hasTouch) addEvent(document.getElementsByTagName('body')[0],'touchmove', this._preventDefaultBodyMove);

      this.selection = false;

      this.currentListItem = listItem;

      this.anchorDate = this._getDateFromElement(listItem);

      this.preSelection = { begin: this.anchorDate, end: this.anchorDate };

      this._renderSelection(this.preSelection, true);

    },
    _updatePreselection: function(listItem) {

      if (this.currentListItem == listItem) return;

      this.currentListItem = listItem;

      var date = this._getDateFromElement(listItem);

      if (this.options.range) {
        this.preSelection = (date < this.anchorDate)?{ begin: date, end: this.anchorDate }:{ begin: this.anchorDate, end: date };
      } else {
        this.preSelection = { begin: date, end: date };
      }

      this._switchMonthOnTimer(listItem, date);

      this._renderSelection(this.preSelection, true);

    },
    _completePreselection: function(listItem) {

      if (hasTouch) document.getElementsByTagName('body')[0].removeEventListener('touchmove', this._preventDefaultBodyMove, false);

      this.currentListItem = false;

      this.setSelected(this.preSelection, false);

      this._renderSelection(this.selection);

      this.preSelection = false;

      if (typeof this.options.onSelect != 'undefined') this.options.onSelect(this.options.range?this.selection:this.selection.begin);

      this._clearHoverTimer();

    },
    _switchMonthOnTimer: function(listItem, date) {

      var toggle = false,
        self = this,
        sameMonth = (self._getDisplayedMonth().getMonth() == date.getMonth());

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

        if (typeof this.hoverTimer == 'undefined') this.hoverTimer = setTimeout(function(){

          if (toggle == 'next') {
            self.showNext();
          } else if (toggle == 'prev') {
            self.showPrevious();
          }

          self._clearHoverTimer();

        }, this.options.switchMonthOnHoverDelay);

      } else {

        this._clearHoverTimer();

      }

    },
    _clearHoverTimer: function() {

      if (this.hoverTimer) clearTimeout(this.hoverTimer);

      this.hoverTimer = undefined;

    },
    _getDateFromElement: function(liElement) {

      var ulIndex = getChildIndex(liElement.parentNode),
          incMonth = 0,
          dateValue = parseInt(liElement.getElementsByTagName('span')[0].innerHTML, 10),
          displayedMonth = this._getDisplayedMonth();

      if ((ulIndex==0) && (dateValue>10)) incMonth = -1;

      if ((ulIndex>=4) && (dateValue<12)) incMonth = 1;

      return new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + incMonth, dateValue);

    },
    _incDisplayedMonth: function() {

      var displayedMonth = this._getDisplayedMonth();

      displayedMonth.setMonth(displayedMonth.getMonth()+1);

      this._setDisplayedMonth(displayedMonth);

    },
    _decDisplayedMonth: function() {

      var displayedMonth = this._getDisplayedMonth();

      displayedMonth.setMonth(displayedMonth.getMonth()-1);

      this._setDisplayedMonth(displayedMonth);

    },
    _setDisplayedMonth: function(date) {

      this.displayedMonth = date;

      this._renderCalendar();

    },
    _getDisplayedMonth: function() {

      if (typeof this.displayedMonth == 'undefined') this.displayedMonth = new Date();

      return this.displayedMonth;

    },
    _clearSelectionRender: function() {

      var self = this;

      if (!this.displayedCalendarElement) return;

      forEach(getElementsByClassName(getElementsByClassName(this.displayedCalendarElement, this.options.classes.calendarBody)[0], this.options.classes.selected), function(listItem) {

        removeClass(listItem, self.options.classes.selected);

      });

    },
    _renderSelection: function(selection, preSelection) {

      if (!this.displayedCalendarElement) return;

      var iDate = false, 
        i=0, 
        classes,
        self = this,
        currentMonth = self._getDisplayedMonth().getMonth(),
        preSelection = (typeof preSelection == 'undefined')?false:preSelection;

      forEach(getElementsByClassName(this.displayedCalendarElement, this.options.classes.calendarBody)[0].getElementsByTagName('li'), function(listItem) {
      
        classes = [];

        if (!iDate) iDate = self._getDateFromElement(listItem);
        else iDate.setDate(iDate.getDate()+1);

        if (self._isWithinRange(iDate, selection)) classes.push(preSelection?self.options.classes.preSelected:self.options.classes.selected);

        if (self._isToday(iDate)) classes.push(self.options.classes.today);

        if (iDate.getMonth() != currentMonth) classes.push(self.options.classes[i++<7?'prevMonthDate':'nextMonthDate']);

        if (self.options.filter) classes = self.options.filter(iDate, classes);

        listItem.className = classes.join(' ');

      });

    },
    _generateCalendarHTML: function(displayedMonth) {

      var i,
        render = this.options.template,
        regexp, curDate,
        varMonth = 0,
        selected = this._getSelected(),
        monthStack = this._getMonthStack(displayedMonth.getMonth(), displayedMonth.getFullYear());

      //render days

      for (i = 0; i<monthStack.length; i++) {

        regexp = new RegExp('#d' + (i>9?'':'0') + i);

        render = render.replace(regexp, monthStack[i]);

        var mSi = parseInt(monthStack[i], 10);

        // add classes for prev and next month days and selected

        var classes = [];

        regexp = new RegExp('#cls' + (i>9?'':'0') + i);

        varMonth = 0;

        if ((i<7) && (mSi>10)){

          classes.push(this.options.classes.prevMonthDate);
          varMonth = -1;

        } else {

          // 
          if ((i>27) && (mSi<13)) {

            classes.push(this.options.classes.nextMonthDate);
            varMonth = 1;

          }

        }

        curDate = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + varMonth, mSi);

        if (selected) if (this._isWithinRange(curDate, selected)) classes.push(this.options.classes.selected);

        if (this._isToday(curDate)) {
          classes.push(this.options.classes.today);
        }

        if (this.options.filter) this.options.filter(curDate, classes);

        render = render.replace(regexp, classes.length?' class="' + classes.join(' ') + '"':'');

      };


      // render weekdays
      for (i=0; i<7; i++) {

        regexp = new RegExp('#wd' + i);

        render = render.replace(regexp, this.options.weekDays[this.options.lang][(i + this.options.firstDayOfWeek)%7]);

      };
      
      // render title
      render = render.replace('#title', this.options.monthNames[this.options.lang][displayedMonth.getMonth()] + ' ' + displayedMonth.getFullYear());

      // render nav icons

      render = render.replace('#navprev', this.options.navDomContent.prev).replace('#navnext', this.options.navDomContent.next);

      return render;

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

        } else {

          // set origin calendar if does not exist and render current month calendar
          if (!getElementsByClassName(this.element, this.options.classes.originCalendar).length) {
            getElementsByClassName(this.element, this.options.classes.calendar)[0].setAttribute('style', 'display:none;');
            getElementsByClassName(this.element, this.options.classes.calendar)[0].className = this.options.classes.originCalendar;  
          } else {
            this.element.removeChild(getElementsByClassName(this.element, this.options.classes.calendar)[0]);
          }

        }

      } else {

        if (getElementsByClassName(this.element, this.options.classes.calendar).length)
          this.element.removeChild(getElementsByClassName(this.element, this.options.classes.calendar)[0]);

      }

      var eltToDisplay = document.createElement('div');
      eltToDisplay.className = this.options.classes.calendar;
      eltToDisplay.innerHTML = this._generateCalendarHTML(displayedMonth);

      this.element.appendChild(eltToDisplay);

      this.displayedCalendarElement = getElementsByClassName(this.element, this.options.classes.calendar)[0];

      makeUnselectable(this.element);

      this._applyBehavior();

    },
    _getMonthStack: function(month, year) {

      var calStack = [], 
          day = new Date(year, month + 1, 0), //start with the last day of the month
          i;

      // shove in month days
      i = day.getDate();

      while(i--)
        calStack.unshift((i+1) + '');

      // every day of the month is now in the stack,
      // shove in days of previous month

      day = new Date(year, month, 1);

      offsetDays = (day.getDay()-this.options.firstDayOfWeek)%7;
      offsetDays = offsetDays<0?offsetDays+7:offsetDays;

      while(offsetDays--) {

        day.setDate(day.getDate()-1);

        calStack.unshift(day.getDate() + '');

      };

      // shove in days of next month
      day = new Date(year, month + 1, 0);

      while(calStack.length < 42) {

        day.setDate(day.getDate()+1);

        calStack.push(day.getDate() + '');

      }

      return calStack;

    },
    _isToday: function(date) {

      if (typeof this.today == 'undefined') this.today = new Date().toDateString();

      return (date.toDateString() == this.today);

    },
    _isWithinRange: function(date, range) {

      var dateString = date.toDateString();
      var rangeStrings = {begin: range.begin.toDateString(), end: range.end.toDateString() };

      if ((dateString == rangeStrings.begin) || (dateString == rangeStrings.end)) return true;

      if ((date>=range.begin) && (date <= range.end)) return true;

      return false;

    },
    _getActualListItem: function(listItem, event) {

      if (typeof event == 'undefined') return listItem;
      if (typeof event.touches == 'undefined') return listItem;

      return elementFromDocumentPoint(event.touches[0].pageX, event.touches[0].pageY).parentNode

    }
  };


  var setCibulCalendar = function(elementId, options) {

    // on field select, need to create element
    // on click elsewhere need to hide it

    var element = document.getElementById(elementId),
    calCanvas,
    calendar,
    inFocus = false,
    _init = function() {
      options = extend({
        onSelect: _onSelect,
        separator: ' - ',
        canvasClass: 'calendar-canvas',
        offset: {top: 5, left: 0 }
      }, options?options:{});

      addEvent(element, 'click', _focus);
      addEvent(document.getElementsByTagName('body')[0], 'click', function(){
        if (!inFocus) _blur();
        inFocus = false;
      });
    },
    _focus = function() {
      inFocus = true;
      if (!calCanvas) _createCalendar();

      extend(calCanvas.style, {
        position: 'absolute',
        top: (element.offsetTop + element.offsetHeight + options.offset.top) + 'px',
        left: element.offsetLeft + options.offset.left + 'px'
      });

      calCanvas.style.display = 'block';

      element.blur();
    },
    _blur = function() {
      if (calCanvas) calCanvas.style.display = 'none';
    },
    _createCalendar = function() {

      calCanvas = document.createElement('div');
      calCanvas.className = options.canvasClass;

      if (!element.parentNode.style.position) element.parentNode.style.position = 'relative';

      calCanvas.style.position = 'absolute';

      addEvent(calCanvas, 'click', _focus);

      element.parentNode.appendChild(calCanvas);

      new CibulCalendar(calCanvas, options);

    },
    _onSelect = function(newSelection) {

      element.value = newSelection.begin?_dateToString(newSelection.begin) + (newSelection.begin!=newSelection.end?options.separator+_dateToString(newSelection.end):''):_dateToString(newSelection);
      fireEvent(element, 'change');

      setTimeout(_blur,200);
    },
    _dateToString = function(date) {
      return _fZ(date.getDate()) + '/' + _fZ(date.getMonth()+1) + '/' + date.getFullYear();
    },
    _fZ = function(n) {
      return (n>9?'':'0') + n;
    };

    _init();

  },
  extend = function(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
  },
  getElementsByClassName = function(node, classname) {
    var a = [];
    var re = new RegExp('(^| )'+classname+'( |$)');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
  },
  isElement = function(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  },
  forEach = function(array, action) {
    for (var i = 0; i < array.length; i++)
      action(array[i]);
  },
  addEvent = function(elem, types, eventHandle) {
    if (elem == null || elem == undefined) return;
    if (typeof types == 'string') types = [types];
    forEach(types, function(type){
      if ( elem.addEventListener ) {
        elem.addEventListener( type, eventHandle, false);
      } else if ( elem.attachEvent ) {
          elem.attachEvent( "on" + type, eventHandle );
      } else {
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
      } else {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, false, true);
        elem.dispatchEvent(evt);
      }
    });
  },
  makeUnselectable = function(node) {
    if (node.nodeType == 1) node.setAttribute("unselectable", "on");
    
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
  },
  previousObject = function(elem) {
    
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
    } else if (window.pageXOffset > 0) {   // page scrolled to the right
      return (window.document.elementFromPoint(window.pageXOffset + window.innerWidth -1, 0) == null);
    }
    return false; // no scrolling, don't care
  },
  elementFromDocumentPoint = function(x,y) {
    if (elementFromPointIsUsingViewPortCoordinates()){
      return window.document.elementFromPoint(x - window.pageXOffset, y - window.pageYOffset);
    } else {
      return window.document.elementFromPoint(x,y);
    }
  };

  extend(window, {
    CibulCalendar: CibulCalendar,
    setCibulCalendar: setCibulCalendar
  });

})();
