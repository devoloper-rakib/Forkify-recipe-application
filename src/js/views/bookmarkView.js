import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2
import previewView from './previewView.js';
class BookmarksView extends View {
	// Point : Private property
	_parentElement = document.querySelector('.bookmarks__list');
	_errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
	_message = '';

	addHandlerRender(handler) {
		window.addEventListener('load', handler);
	}

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewView.render(bookmark, false))
			.join('');
	}

	// Point : added click event
}

export default new BookmarksView();
