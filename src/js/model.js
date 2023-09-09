import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
};

// Point : Create recipe object
const createRecipeObject = function (data) {
	const { recipe } = data.data;

	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }), // Point : Conditional property ( if recipe.key exist then add key: recipe.key otherwise do nothing )
	};
};

// Point : Load recipe
export const loadRecipe = async function (id) {
	const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

	state.recipe = createRecipeObject(data);

	try {
		// Point : Check if current recipe is bookmarked
		if (state.bookmarks.some((bookmark) => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;
	} catch (error) {
		console.error(`${error} :(`);
		throw error;
	}
};

// Point : Load search results
export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;

		const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

		state.search.results = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }), // Point : Conditional property ( if rec.key exist then add key: rec.key otherwise do nothing )
			};
		});
		state.search.page = 1;
	} catch (error) {
		console.error(`${error} :(`);
		throw error;
	}
};

// Point : added Pagination function
export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;
	return state.search.results.slice(start, end);
};

// Point : added Update Servings function
export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
		// newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4 === newQt
	});

	state.recipe.servings = newServings;
};

// Point : Control Bookmark
export const addBookmark = function (recipe) {
	// Point : Add bookmark
	state.bookmarks.push(recipe);

	// Point : Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	persistBookmarks();
};

// Point : Delete Bookmark
export const deleteBookmark = function (id) {
	// Point : Delete bookmark
	const index = state.bookmarks.findIndex((el) => el.id === id);
	state.bookmarks.splice(index, 1);

	// Point : Mark current recipe as NOT bookmark
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	persistBookmarks();
};

// Point : localStorage

const persistBookmarks = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// Point : Clear localStorage ( for testing )
const clearBookmarks = function () {
	localStorage.clear('bookmarks');
};

// clearBookmarks();

// Point : Upload Recipe
export const uploadRecipe = async function (newRecipe) {
	try {
		const ingredients = Object.entries(newRecipe)
			.filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
			.map((ing) => {
				const ingArr = ing[1].split(',').map((el) => el.trim());
				// const ingArr = ing[1].replaceAll(' ', '').split(',');
				if (ingArr.length !== 3)
					throw new Error(
						'Wrong ingredient format! Please use the correct format :)',
					);
				const [quantity, unit, description] = ingArr;
				return { quantity: quantity ? +quantity : null, unit, description };
			});

		// Point : Upload Recipe
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};

		console.log(recipe);

		const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (error) {
		throw error;
	}
};
