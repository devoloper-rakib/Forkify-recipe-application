// Point : import all modules
console.log('controller.js working...');

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarkView.js';
import paginationView from './views/paginationView..js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from '../js/config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// Point : added Show Recipe function

const controlRecipe = async function () {
	// Point : loading recipe ( try catch finally )
	try {
		const id = window.location.hash.slice(1);

		if (!id) return; /// Point : Guard clause

		// Point : Render spinner
		recipeView.renderSpinner();

		// Point : 0) Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());

		// Point : Update bookmarks view
		bookmarksView.update(model.state.bookmarks);

		// Loading recipe
		await model.loadRecipe(id);

		// Point : Render Recipe
		recipeView.render(model.state.recipe);
	} catch (error) {
		// Point : Temp error handling
		recipeView.renderError();
		console.error(`${error} :(`);
	}
};

// Point : added Search Results function
const controlSearchResults = async function () {
	try {
		// Point : Render spinner
		resultsView.renderSpinner();

		// Point 1 : Get search query
		const query = searchView.getQuery();
		if (!query) return; /// Point : Guard clause

		// Point 2 : Load Search Results
		await model.loadSearchResults(query);

		// Point 3 : Render Results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// Point 4 : Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
};

// Point : added Pagination function
const controlPagination = function (goToPage) {
	// Point 1 : Render NEW Results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// Point 2 : Render NEW pagination buttons
	paginationView.render(model.state.search);
};

// Point : controlServings
const controlServings = function (newServings) {
	// Point : Update the recipe servings (in state)
	model.updateServings(newServings);

	// Point : Update the recipe view
	// Point : recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

// Point : Control Bookmark
const controlAddBookmark = function () {
	// Point : 1) Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// Point : 2) Update recipe view
	recipeView.update(model.state.recipe);

	// Point : 3) Render bookmarks
	bookmarksView.render(model.state.bookmarks);

	// Point : 4) Render initial pagination buttons

	// Point : 5) Update bookmark view
};

// Point : bookmark handler
const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

// Point : added Add Recipe function
const controlAddRecipe = async function (newRecipe) {
	try {
		// Point : Show loading spinner
		addRecipeView.renderSpinner();

		// Point : Upload the new recipe data
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		// Point : Render recipe
		recipeView.render(model.state.recipe);

		// Point : Success message
		addRecipeView.renderMessage();

		// Point : Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Point : Change ID in URL
		window.history.pushState(null, '', `#${model.state.recipe.id}`); /// Point : Change ID in URL ( without reloading and it  takes 3 arguments[state, title , url ] )

		// Point : Close form window
		setTimeout(function () {
			addRecipeView.toggleWIndow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (error) {
		console.error(`${error} :(`);
		addRecipeView.renderError(error.message);
	}
};

const welcome = function () {
	const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');

	if (!hasVisitedBefore) {
		alert('Welcome to the Forkify App!');
		console.log('Welcome to the Forkify App!');
		localStorage.setItem('hasVisitedBefore', true);
	}
};

const loadLogo = document.getElementById('loadLogo');
loadLogo.addEventListener('click', function () {
	window.location.href = 'https://forkify-find-your-recipe.netlify.app/';
});

// Point : added Event Listener ( must be in the bottom )
const init = function () {
	welcome();
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipe);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
