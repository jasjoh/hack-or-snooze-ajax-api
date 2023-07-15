"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  // try {
  //   const hostName = story.getHostName();
  // } catch (error) {
  //   console.log("hostName function not found");
  //   const hostName = invalid;
  // }
  console.log("the story is:", story);
  const hostName = story.getHostName();


  const $jQueryStory = $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>`);

  if (currentUser) {
    if (currentUser.isFavoriteStory(story.storyId)) {
      //add filled star class
      $jQueryStory.prepend(`<i class="Fav-star bi bi-star-fill"></i>`);
    } else {
      //add empty star class
      $jQueryStory.prepend(`<i class="Fav-star bi bi-star"> </i>`);
    }
  }


  return $jQueryStory;
  // if the current story is a favorite
  // insert the star into the jQueryStory object with solid fill
  // otherwise, insert with no fill
  // TODO: Call User Class function to check the above

  // return $(`
  //     <li id="${story.storyId}">
  //       <i class="bi bi-star"></i>
  //       <i class="bi bi-star-filled"></i>
  //       <a href="${story.url}" target="a_blank" class="story-link">
  //         ${story.title}
  //       </a>
  //       <small class="story-hostname">(${hostName})</small>
  //       <small class="story-author">by ${story.author}</small>
  //       <small class="story-user">posted by ${story.username}</small>
  //     </li>
  //   `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** gets the list of favorites from user, generates HTML and puts on page. */
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  console.debug("the current user:", currentUser);
  console.debug("the current user's favorites are:", currentUser.favorites);

  $allStoriesList.empty();

  // loop through all of the user's favorites and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



/**This function will get the New Story form data ,invokes the
 * addStory Method and  inkokes putStoriesOnPage method
 *
 *  */
async function getNewStoryAndAdd(evt) {
  evt.preventDefault();
  const storyObject = {
    author: $("#author-name").val(),
    title: $("#new-story-title").val(),
    url: $("#new-story-url").val()
  };
  const storyInstance = await storyList.addStory(currentUser, storyObject);

  // generate story markup and insert into story list
  const $storyMarkup = generateStoryMarkup(storyInstance);
  $allStoriesList.prepend($storyMarkup);
  $newStoryForm.hide();
}

$newStoryForm.on("submit", getNewStoryAndAdd);

/** Accepts a story ID and either adds or removes it as a favorite;
 * Also refreshes the page so that favorite status is updated
 */
async function toggleFavoriteStory(storyId) {
  // example store: '1f6dc862-198f-4bf5-8302-fe6bf88828a5'
  console.log("toggling favorite story:", storyId);
  //if favorite story selected ,unfill story reresh UI
  if (currentUser.isFavoriteStory(storyId)) {
    console.log("we think it's currently a favorite");
    console.log("we are going to call unFavorite");
    await currentUser.unFavorite(storyId);
    putStoriesOnPage();
  } else {
    console.log("we think it's currently NOT a favorite");
    console.log("we are going to call addFavorite");
    await currentUser.addFavorite(storyId);
    console.log('favorited', storyId);
    putStoriesOnPage();
  }
}

$("#all-stories-list").on("click", ".Fav-star", async function (evt) {
  const storyId = $(evt.target).closest("li").prop("id");
  // console.log("story id (from prop(id)) is:", storyId);
  // console.log("value of attr(id) is:", $(evt.target).closest("li").attr("id"));
  await toggleFavoriteStory(storyId);
});

