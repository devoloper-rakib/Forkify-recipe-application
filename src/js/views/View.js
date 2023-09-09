import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
	// Point : Private variable
	_data;

	/**
	 * Render the Recived Object to the DOM
	 *
	 * @param {Object | Object[]}  data The data to be rendered (e.g. recipe)
	 * @param {boolean} [render= true] if false, create markup string instead of rendering to the DOM
	 *@returns {undefined | string} A markup string is returned if render = false
	 * @this {Object} View instance
	 * @author Rakib Hasan Sohag
	 * @todo Finish implementation
	 *
	 *
	 */

	// / : Public method

	// Point : render method
	render(data, render = true) {
		// Point : if data is not an array
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();

		// Point : if render is false
		if (!render) return markup;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkup();

		// Point : convert string to DOM object
		const newDOM = document.createRange().createContextualFragment(newMarkup);

		// Point : convert DOM object to array
		const newElements = Array.from(newDOM.querySelectorAll('*'));

		// Point : convert DOM object to array
		const curElements = Array.from(this._parentElement.querySelectorAll('*'));

		// Point : compare two arrays
		newElements.forEach((newEl, i) => {
			const curEl = curElements[i];

			// Point : update changed TEXT
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ''
			) {
				curEl.textContent = newEl.textContent;
			}

			// Point : update changed ATTRIBUTES
			if (!newEl.isEqualNode(curEl)) {
				Array.from(newEl.attributes).forEach((attr) =>
					curEl.setAttribute(attr.name, attr.value),
				);
			}
		});
	}

	_clear() {
		this._parentElement.innerHTML = '';
	}

	// Point : render spinner
	renderSpinner = function () {
		const markup = `
          <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	};

	// Point : render error

	renderError(message = this._errorMessage) {
		const markup = `
		
		<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
		  `;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	// Point : render success

	renderMessage(message = this._message) {
		const markup = `
		
		<div class="message">  
			<div>
			  <svg>
				<use href="${icons}#icon-smile"></use>
			  </svg>
			</div>
			<p>${message}</p>
		  </div>
		  `;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
