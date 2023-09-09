import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2
import previewView from './previewView.js'; // parent class
class ResultsView extends View {
	// Point : Private property
	_parentElement = document.querySelector('.results');
	_errorMessage = 'No recipes found for your query! Please try again ;)';
	_message = '';

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewView.render(bookmark, false))
			.join('');
	}

	// Point : added click event
}

export default new ResultsView();
