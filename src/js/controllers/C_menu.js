import view from "Js/views/V_menu.js"
import memoryTest from "Js/controllers/C_memory-test.js";
import notifications from "Js/views/V_notifications";
import loader from "Js/views/V_main.js";
import settings from "Js/controllers/C_settings.js";


class C_Menu {

  /**
   * Constructor 
   * - Set callback function
   * - Initialize variables
   * - Populate the language menu
   */
  constructor() {

    // Callback menu for back button
    view.setBackBtnCallback(() => { this.onBackBtn() });
    view.setMenuBtnCallback((e) => { this.onMenuBtn(e) });
    view.setModalHiddenCallback(() => { this.onModalHide() })

    // Set the initial current menu
    this.currentMenu = 'main';

    // Populate the language menu
    view.populateLanguages();

    // When the modal is shown, populate the current memory tests selection
    view.setModalShowCallback(() => {
      view.populateActiveSelection(memoryTest.model().getPaths());
    })
  }




  /**
   * Process a click in the menu button
   * @param {object} event The event properties
   */
  onMenuBtn(event) {
    
    //console.log(event);
    
    switch (event.type) {
      case 'navigation': this.goToMenu(event.target); break;

      case 'add-remove-quiz':

        // The button is not checked => Remove quiz
        if (!event.checked) {

          // Remove the memory test
          if (!memoryTest.removeQuiz(event.target)) {

            // Do not allow removing last test and check the radio button
            notifications.warning('No Test Selected', `You must select at least one memory test.`, 1500);
          }
          view.updateRadioCheckboxes(memoryTest.model().getPaths());
          view.populateActiveSelection(memoryTest.model().getPaths());
        }
        else {
          // The button is checked => Add a new quiz

          // Add a message in the loader
          let id = loader.newMessage(`Loading memory test ${event.target}.`);

          // Load a new quiz
          memoryTest.addQuiz(event.target)
            .then(() => {
              view.updateRadioCheckboxes(memoryTest.model().getPaths());
              view.populateActiveSelection(memoryTest.model().getPaths());
              loader.setSuccess(id);
            })
            .catch(() => {
              view.updateRadioCheckboxes(memoryTest.model().getPaths());
              view.populateActiveSelection(memoryTest.model().getPaths());
              loader.setSuccess(error);
              notifications.error('Loading Error', `Error while loading the memory test ${event.target}.`);
            })

        }

        break;

      case 'select-quiz':
        if (event.checked) {

          // Add a message in the loader
          let id = loader.newMessage(`Loading single memory test ${event.target}.`);

          // Load and replace with a new quiz
          memoryTest.replaceAllQuiz(event.target)
            .then(() => {
              view.updateRadioCheckboxes(memoryTest.model().getPaths());
              view.populateActiveSelection(memoryTest.model().getPaths());
              loader.setSuccess(id);

            })
            .catch((error) => {
              console.error(error);
              view.updateRadioCheckboxes(memoryTest.model().getPaths());
              view.populateActiveSelection(memoryTest.model().getPaths());
              loader.setError(id);
              notifications.error('Loading Error', `Error while loading a single memory test ${event.target}.`);
            })

        }

        break;

      case 'settings':
        settings.setParameter(event.key, event.value);
        break;

    }
  }


  /**
   * Go to the requested menu
   * @param {string} target The menu to show
   */
  goToMenu(target) {

    // Get the target 
    let menu = target.split('/');
    
    // Populate the next menu
    switch (menu[0]) {
      case 'main':
        view.hideSelection();
        break;

      case 'settings':
        view.updateSettings();
        break;

      case 'languages':
        view.showSelection();
        break;

      case 'categories':
        view.populateCategories(menu[1]);
        view.showSelection();
        break;

      case 'list':
        view.populateList(menu[1], menu[2]);
        view.updateRadioCheckboxes(memoryTest.model().getPaths());
        view.showSelection();
        break;
    }

    // Show the next menu
    this.currentMenu = menu[0];
    view.showMenu(menu[0]);
  }



  /**
   * Callback function called when the back button is clicked
   */
  onBackBtn() {

    // Select previous menu according to the current one
    switch (this.currentMenu) {
      case 'main':
        view.hideSelection();
        view.hideModal();
        return;
      case 'settings':
        this.currentMenu = 'main';
        break;
      case 'languages':
        this.currentMenu = 'main';
        view.hideSelection();
        break;
      case 'categories': this.currentMenu = 'languages'; break;
      case 'list': this.currentMenu = 'categories'; break;
    }
    // Show the previous menu
    view.showMenu(this.currentMenu);
  }


  /**
   * Callback function called when the modal is closed
   */
  onModalHide() {

    // Set the initial current menu
    this.currentMenu = 'main';
    view.showMenu('main');
    view.hideSelection();
    
    // Show the loader until message are pending
    loader.showLoaderWhilePending()
      .then(() => {
        memoryTest.reset().then(() => {
          loader.hideLoader();
          memoryTest.start();
        })
      })
  }

}

export default new C_Menu();