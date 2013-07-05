CibulCalendar
=============

A javascript date range picker

Go here for documentation: http://tech.cibul.net/cibulcalendar-a-date-range-picker/

changelog:

2013-07-05 - v0.2.5 - fixed Sunday 12th of next month render bug, range selection with field helper function

2013-06-29 - v0.2.4 - bugfix
  bug fixed: range selection over several months starting on a date that is not of the displayed month

2013-03-10 - v0.2.3 - added features: Single select, Popup helper


0.2.2 - Debug on calendar touch events for iOS devices

0.2.1 - Calendar has disable / enable methods which freeze all navigation and selection and adds a 'disabled' class
  debug:
    - added a line to the calendar. Every now and then it is needed.

0.2 - Lots of debug and features added
  features:
    - freezes page scroll down on touchmove
    - navigation between months works for touch devices
    - possible to customize prev/next month navigation icons
    - possible to add languages without having to set the preset ones over again
    - possible to manipulate classes with callback for each date

0.12 - modification on the month switching
  features:
    - switch to next month on last/first month item prolonged hover rather than previous/next month selections

0.1 - first release
  features:
    - drag and drop multiselect
    - full month select
