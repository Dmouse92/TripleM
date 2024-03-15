# Triple M
### Japanese Auto Import Website Based on WP Theme
##### [Original Theme (Malen)](https://preview.themeforest.net/item/malen-car-service-repair-wordpress-theme/full_screen_preview/45980509?_ga=2.180983919.975271207.1709766736-119461793.1709505036)
Basic HTML/CSS/JS Website Built for a client
Technologies used: HTML CSS JS JQuery SASS Bootstrap NodeJS ExpressJS

### Overview

#### Client Requests

- Pages:
  * Home
  * Vehicles
  * Import
  * About
  * Contact/Appointment
    
- Means of Adding and Managing Vehicles
  * DB: JSON As Storage JS as Interface
    - Since the ability to purchase cars online was not wanted and the client didn't intend to add/remove/modify listings often, a JSON based DB was the best choice in terms of simplicity and usability, being relatively easy for me to implement, being reliable/efficient, and being easy to debug or view by my client.
  * GUI Interface at website.com/jsonloader.html
    * Add, Remove, Edit, Re-Order Products
      * Add - Add Car/Details, FuelEco and Features as Comma Delim List (City, HWY) (Feature 1, Feature 2), Images upload and visible as sortable (drag and drop) gallery, resized/cropped to 1024x1024 on load
      * Remove - TODO
      * Edit - TODO
      * Re-Order - TODO
    * Vehicle Files Stored in Readable Means -
       - DIR/assets/ASSET_TYPE/vehicles/MAKE_MODAL_VIN/MAKE_MODAL_VIN_ORDER.TYPE
         OR
       - DIR/pages/vehicles/MAKE_MODAL_VIN/MAKE_MODAL_VIN_ORDER.TYPE


