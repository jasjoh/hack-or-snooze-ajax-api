"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navFavorites.show();
  $navSubmit.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Displays new story submission form on click on "submit" */
function navNewStory(evt) {

  console.log("navNewStory func called with:", evt);
  $newStoryForm.show();
}

$navSubmit.on("click", navNewStory);

/** Displays my favorites on click on "submit" */
function navFavorites(evt) {

  console.log("navFavorites func called with:", evt);
  evt.preventDefault();
  hidePageComponents();
  // TODO: show list of favorites akin to putStoriesOnPage()
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavorites);
