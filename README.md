# Team 2 CollegeChef

## Phase 3
* Setup
  - Check out repository
  - Do "npm install"
  - Do "mongod"
  - Do "npm start" or "node index.js"
* API testing
  - If linix: do "npm test"
  - If using postMan, use option "raw" under Body for post requests


## Phase 2
**Please use a server to open our site** or else some styles will not be loaded.

**Please note that the smallest width and height our website support is 270 and 370**. We found that this size is on the border of usability. It's not worthy to adapt it to a smaller size because it would be near impossible to use. For any screen size that has width **or** height that is smaller than our limit will only receive a static image. 

Here is a list of what **UI components** are functional (checked) and what are just 'place-holders' and will be implemented later:
* Navigation bar and Footer
  - [x] Home Page link
  - [x] Recipe Browser link
  - [x] My Profile link
  - [ ] Sign Out link
  - [x] Sign Up link
  - [x] Login link
  - [x] About Us link
  - [x] Feedback link
  - [x] Responsive Navigation and Footer
* Home Page
  - [x] Ingredient search bar - can filter ingredients by name
  - [x] Ingredients buttons - can be selected and pinned
  - [ ] Search button - can show recipe search result list based on ingredients selected.
  - [x] Recipe lists - are expandable and collapsible
  - [x] Recipe card - redirects to the Recipe View Page.
* Recipe View Page
  - [x] All detailed info about a recipe is shown.
  - [x] Rating star widget 
  - [x] Favorite the recipe by clicking heart on the right-top corner of the image
  - [x] Comment form - can post new comment
  - [ ] Comments - get list of existing comments
* Recipe Browser Page
  - [x] Alphabet sorting buttons - can filter recipes
  - [x] Recipe search bar - can filter recipes by name
  - [x] Responsive - alphabet buttons will be hidden in small screens
* User Profile Page
  - [x] Display different content for different account type (user vs. admin)
  - [x] Reset Password link
  - [x] Edit Profile link
  - [x] Edit Uploaded Recipes
  - [x] Delete Uploaded Recipes - confirm window
  - [x] Add New Recipe link
  - [x] Notification Settings link
  - [x] Click notification message will refer to Recipe View.
  - [x] Edit other user's recipes (Admin only)
  - [x] Delete other user's recipes (Admin only) - confirm window
  - [x] Edit other user's profiles (Admin only)
  - [x] Delete other user's profiles (Admin only) - confirm window

Note:

1. Currently all recipe cards in home page, recipe browser and user profile redirect to the same recipe view page. We will render different content for different recipes in future phases.

2. HTML files in components folder are components and are not their own HTML pages.  We load them into our pages using JS, so they are missing some tags e.g. body tags.  That said, they still satisfy the W3 validator.
