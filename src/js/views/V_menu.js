import "Assets/css/menu.css";
import * as bootstrap from 'bootstrap';
import quizzes from "Js/models/M_quizzes-list.js";
import memoryTest from "Js/models/M_memory-test.js";



class V_menu {


  /**
   * Constructor Get the elements and initialize the bootstrap components
   */
  constructor() {

    // Get the modal element
    this.modalEl = document.getElementById("menu-modal")
    this.modal = new bootstrap.Modal(this.modalEl);

    this.onModalHiddenCallback = () => { };
    this.modalEl.addEventListener('hidden.bs.modal', (e) => { this.onModalHiddenCallback(e) })

    // Get the title modal
    this.titleEl = this.modalEl.querySelector('.modal-title');


    setTimeout(() => {
      console.log("Show modal on statup");
      this.modal.show();
    }, 1000)

    // Set callback when the user click the back button
    this.onBackBtnCallback = () => { };
    this.backBtn = this.modalEl.querySelector(".back-btn");
    this.backBtn.addEventListener('click', () => { this.onBackBtnCallback() });

    // Get the parent of all collapsable element to close the other when an element is shown
    let parent = this.modalEl.querySelector(".content");
    this.onMenuBtnCallback = () => { };
    parent.addEventListener("click", (event) => { this.onBtnMenuClicked(event); });


    this.menuCollapse = {};

    // Prepare the collapsable menus
    this.mainMenuEl = this.modalEl.querySelector(".main-menu");
    this.menuCollapse.main = new bootstrap.Collapse(this.mainMenuEl, { toggle: false, parent: parent });

    this.mainLanguagesEl = this.modalEl.querySelector(".languages-menu");
    this.menuCollapse.languages = new bootstrap.Collapse(this.mainLanguagesEl, { toggle: false, parent: parent });

    this.mainCategoriesEl = this.modalEl.querySelector(".categories-menu");
    this.menuCollapse.categories = new bootstrap.Collapse(this.mainCategoriesEl, { toggle: false, parent: parent });

    this.mainListEl = this.modalEl.querySelector(".list-menu");
    this.menuCollapse.list = new bootstrap.Collapse(this.mainListEl, { toggle: false, parent: parent });

    this.titles = {};
    this.titles['main'] = 'Menu';
    this.titles['languages'] = 'Languages';
    this.titles['categories'] = 'Categories';
    this.titles['list'] = 'Memory Tests';

  }


  /**
   * Populate the language menu
   */
  populateLanguages() {

    // Get the parent element
    let parent = this.modalEl.querySelector(".content .languages-menu .parent");

    // For each language, create a button
    for (const [key, value] of Object.entries(quizzes)) {

      // Prepare the button properties
      let properties = {};
      properties.innerText = value.name;
      properties.attributes = {}
      properties.attributes['data-type'] = 'navigation';
      properties.attributes['data-target'] = `categories/${key}`;

      // Append the button to menu
      this.appendButton(parent, properties);
    }
  }


  /**
   * Populate the categories menu
   * @param {string} language The language of the category
   */
  populateCategories(language) {

    // Get the parent element
    let parent = this.modalEl.querySelector(".content .categories-menu .parent");

    // Empty the parent
    parent.innerHTML = "";

    // For each language, create a button
    for (const [category, value] of Object.entries(quizzes[language].categories)) {

      // Prepare the button properties
      let properties = {};
      properties.innerText = value.name;
      properties.attributes = {}
      properties.attributes['data-type'] = 'navigation';
      properties.attributes['data-target'] = `list/${language}/${category}`;

      // Append the button to menu
      this.appendButton(parent, properties);
    }
  }


  /**
   * Populate the list menu
   * @param {string} language The language of the list
   * @param {string} category The category of the list
   */
  populateList(language, category) {


    // Get the parent element
    let parent = this.modalEl.querySelector(".content .list-menu .parent");

    // Empty the parent
    parent.innerHTML = "";

    // For each language, create a button
    for (const [testId, value] of Object.entries(quizzes[language].categories[category].list)) {

      let path = `/${language}/${category}/${testId}/`;

      // Prepare the button properties
      let properties = {};
      properties.label = value.name;
      properties.id = path.slice(1, -1).replaceAll('/', '_');
      properties.checked = memoryTest.isPathSelected(`${path}`);
      properties.attributes = {}
      properties.attributes['data-target'] = path;


      // Append the button to menu
      this.appendSwitch(parent, properties);
    }
  }


  /**
   * Append a new switch to the list (parent)
   * @param {element} parent The parent element where the switch is appened
   * @param {object} properties The properties of the switch
   */
  appendSwitch(parent, properties) {


    // Create the main container
    let container = document.createElement('div');
    container.classList.add('d-flex', 'fs-5');



    // Create the radio button container
    let radioContainer = document.createElement('div');
    radioContainer.classList.add('form-check');
    container.append(radioContainer);

    // Create the radio button
    let inputRadio = document.createElement('input');
    inputRadio.classList.add('form-check-input', 'menu-btn')
    inputRadio.checked = properties.checked;
    // Add the attributes
    for (const [key, value] of Object.entries(properties.attributes)) { inputRadio.setAttribute(key, value); }
    inputRadio.setAttribute('type', 'radio');
    inputRadio.setAttribute('data-type', 'select-quiz');
    inputRadio.setAttribute('data-bs-toogle', 'tooltip');
    inputRadio.setAttribute('data-bs-title', 'Select only this test. This will disable all others.');
    new bootstrap.Tooltip(inputRadio, { trigger: 'hover'});
    radioContainer.append(inputRadio);



    // Create the checkbox
    let checkBoxContainer = document.createElement('div');
    checkBoxContainer.classList.add('form-check');
    container.append(checkBoxContainer);

    let inputCheckbox = document.createElement('input');
    inputCheckbox.classList.add('form-check-input', 'menu-btn');
    inputCheckbox.id = properties.id;
    checkBoxContainer.checked = properties.checked;
    inputCheckbox.setAttribute('type', 'checkbox');
    inputCheckbox.setAttribute('data-type', 'add-remove-quiz');
    inputCheckbox.setAttribute('data-bs-toogle', 'tooltip');
    inputCheckbox.setAttribute('data-bs-title', 'Add or remove this memory test.');
    new bootstrap.Tooltip(inputCheckbox, { trigger: 'hover'});

    // Add the attributes
    for (const [key, value] of Object.entries(properties.attributes)) { inputCheckbox.setAttribute(key, value); }
    checkBoxContainer.append(inputCheckbox);



    // Create and add the label
    let label = document.createElement('label');
    label.classList.add('form-check-label', 'w-100')
    label.setAttribute('for', properties.id);
    label.innerText = properties.label;
    checkBoxContainer.append(label)

    // Append the button in the dom
    parent.append(container);

  }


  /**
   * Check a switch in the modal
   * @param {string} id Id of the switch to check
   */
  checkSwitch(id) {
    this.modalEl.querySelector('#' + id).checked = true;
  }


  /**
   * Create and append a new button and append to the parent
   * @param {element} parent The parent element to which the button is appended
   * @param {object} properties The properties of the new button
   */
  appendButton(parent, properties) {

    // Create the button
    var button = document.createElement('button');
    button.classList.add("btn", "btn-lg", "btn-primary", "menu-btn");
    button.setAttribute("type", "button");

    // Add the attributes
    for (const [key, value] of Object.entries(properties.attributes)) {
      button.setAttribute(key, value);
    }

    // Create the span inside the button
    let span = document.createElement('span');
    span.classList.add("luckiest");
    span.innerText = properties.innerText;
    button.append(span);

    // Append the button in the dom
    parent.append(button);
  }


  /**
   * Show a given menu (and close the others)
   * @param {string} label Label of the menu to show
   */
  showMenu(label) {
    this.titleEl.innerText = this.titles[label];
    this.menuCollapse[label].show()
  }


  /**
   * Hide the modal menu
   */
  hideModal() {
    this.modal.hide();
  }


  /**
   * Callback function called when the user click in an interactive element of the menu
   * @param {object} event Detail of the user action
   */
  onBtnMenuClicked(event) {

    // Check if this is an interactive element
    let element = event.target.closest(".menu-btn");
    if (element === null) return;
    
    // Process the event attribute on the button
    let e = {};
    e.type = element.getAttribute('data-type');
    switch (e.type) {

      case 'navigation':
        e.target = element.getAttribute('data-target');
        break;

      case 'add-remove-quiz':
        e.target = element.getAttribute('data-target');
        e.checked = element.checked;
        e.id = element.id;
        break;

      case 'select-quiz':
        e.target = element.getAttribute('data-target');
        e.checked = element.checked;
        e.id = element.id;
        break;
    }

    // Run the callback with the event
    this.onMenuBtnCallback(e)
  }


  /**
   * Set the callback function called when a button menu button is clicked
   * @param {function} callback Function called
   */
  setMenuBtnCallback(callback) {
    this.onMenuBtnCallback = callback;
  }


  /**
   * Set the callback function called when the back button is clicked
   * @param {function} callback Function called
   */
  setBackBtnCallback(callback) {
    this.onBackBtnCallback = callback;
  }


  /**
   * Set the callback function called when the 
   * @param {function} callback Fonction called when the hide instance of the modal is called
   */
  setModalHiddenCallback(callback) {
    this.onModalHiddenCallback = callback;
  }

}


export default new V_menu();