# JS Native Item list app

Web app with add, delete and edit functionality and item draggability.

Features:
- Add item with item name, description and photograph
- Drag and drop list sorting
- Item counter
- Edit item description and image
- Stored list state

Done with vanilla JS and Jquery. Added JSON/Html converter, pure JS library.

Notes:

The two "phantom" items that appear at the begining are on purpose to show the basic drag and drop functionality and to have some extra items in the list to start playing around. You can (and should) delete them.

The session storage strategy is based in localStorage, so if at any point a "reset" is needed, just run localStorage.clear() in your console.