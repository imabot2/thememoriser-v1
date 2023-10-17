
/**
 * Manage the answer bar view (answer bar, flag, submit button...)
 */
export default class V_MemoryTestAnswerBar {

  constructor() {

    // Get the answer input
    this.answerInput = document.getElementById("answer-input");
    this.onInputCallback = () => { };
    this.answerInput.addEventListener("input", () => { this.onInputCallback(this.getAnswerText()); });

    // Get the correction bar
    this.correction = document.getElementById("correction");

    // Callback function and event when the user press Enter key
    this.onEnterCallback = () => { };
    this.answerInput.addEventListener("keypress", (event) => {

      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {

        // Run the callback function
        this.onEnterCallback(this.answerInput.innerText);

        // Cancel the default action (no enter in the answer input)
        event.preventDefault();
      }
    });

    // When the submit button is clicked, run the callback function as if the user pressed Enter
    this.submitBtn = document.getElementById("answer-submit-btn");
    this.submitBtn.addEventListener("click", () => {
      this.onEnterCallback(this.answerInput.innerText);
    })


    // Get the language flag
    this.flagEl = document.getElementById("language-flag");
  }


  /**
   * Clear input field
   */
  clearInput() {
    this.answerInput.innerHTML = "";
  }


  /**
   * Set the callback function when the answer input change
   * @param {function} callback Callback function called when the input change
   */
  onInput(callback) {
    this.onInputCallback = callback;
  }


  /**
   * Set the callback function when the Enter key is pressed in the answer input
   * @param {function} callback Callback function called when the user press enter
   */
  onEnter(callback) {
    this.onEnterCallback = callback;
  }


  getAnswerText() {
    return this.answerInput.innerText;
  }

  hideCorrection() {
    this.correction.style.opacity = "0";
  }

  showCorrection() {
    this.correction.style.removeProperty("opacity");
  }

  /**
   * Set new HTML content in the answer input
   * @param {string} html HTML code to place in the input bar
   */
  setCorrectionHTML(html) {
    this.correction.innerHTML = html;
  }

  /**
   * Disable the answer input
   */
  disableInput() {
    this.answerInput.setAttribute("readonly", "readonly");
    this.answerInput.setAttribute("contenteditable", "false");
  }

  /**
   * Enable the answer input
   */
  enableInput() {
    this.answerInput.setAttribute("readonly", "");
    this.answerInput.setAttribute("contenteditable", "true");
  }

  /**
   * Set the image in the language flag
   * @param {string} imageSrc Path or URL to the flag image
   */
  setLanguageFlag(imageSrc) {
    this.flagEl.src = imageSrc;

    //document.querySelector(':root').style.setProperty("--main-background-image", `url(${imageSrc})`);
  }


  /**
   * Set the prompt to the answer input
   * When the prompt is updated, focus on the answer bar
   * @param {string} prompt The prompt to display in the answer input
   */
  setPrompt(prompt) {
    this.answerInput.setAttribute("placeholder", prompt);
  }


  /**
   * Set focus to the answer bar
   */
  focus() {
    // Set focus on the answer bar at start up
    this.answerInput.focus();
  }

}


