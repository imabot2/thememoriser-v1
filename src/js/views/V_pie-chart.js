import "Assets/css/pie-chart.css";
import Chart from 'chart.js/auto';



export default class V_PieChart {

  /**
   * Constructor, initialize the pie chart
   * @param {element} container The element of the container of the pie-chart
   */
  constructor(container) {

    // Store the container of the pie chart
    this.container = container;
    this.canvasEl = container.querySelector('canvas');

    // Get the label element for updating
    this.valueText = container.querySelector('span');

    // No animation at start up
    this.animation = false;

    // Current ratio of the pie chart
    this.ratio = 0;


    // Create and initialize the pie chart element
    this.chart = new Chart(this.canvasEl, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.ratio, 1 - this.ratio],
          backgroundColor: ['red', 'lightgrey'],
          hoverBackgroundColor: ['red', 'lightgrey'],
          borderWidth: 0,
          spacing: 0,
          hoverOffset: 10,
          hoverBorderRadius: 10,
        }],
      },

      options: {
        cutout: '70%',
        layout: { padding: { left: 50, right: 50, top: 10, bottom: 10 } },
        maintainAspectRatio: false,
        //layout: { padding: 10 },
        responsive: true,
        animation: false, // { animateRotate: false, animateScale: false },
        plugins: {
          legend: { display: true },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: (t) => { return this.tooltipTitleCallback(t) },
              label: (t) => { return this.tooltipLabelCallback(t) }
            }
          },
        },
      }

    });
  }

  /**
   * Update the pie chart with the new ratio
   * @param {float} ratio Ratio to display in the pie chart
   */
  setRatio(ratio) {
    let previousRatio = this.ratio;
    this.ratio = ratio;
    this.chart.data.datasets[0].data = [this.ratio, 1 - this.ratio];
    this.chart.update();
    this.updateValue(previousRatio, this.ratio);
  }

  /**
   * Enable animation in the pie chart
   */
  enableAnimation() {
    this.animation = true;
    this.chart.options.animation = { animateRotate: true, animateScale: false };
  }

  /**
   * Disable animation in the pie chart
   */
  disableAnimation() {
    this.animation = false;
    this.chart.options.animation.animateRotate = { animateRotate: false, animateScale: false };
  }

  /**
   * // Set the colors of the pie chart
   * @param {string} mainColor Color of the first data in the dataset
   * @param {*} secondaryColor Color of the second data in the dataset
   */
  setColors(mainColor, secondaryColor) {
    this.chart.data.datasets[0].backgroundColor = [mainColor, secondaryColor];
    this.chart.data.datasets[0].hoverBackgroundColor = [mainColor, secondaryColor];
    this.chart.update();
  }

  /**
   * Set labels for the pie chart (for the tooltips)
   * @param {string} mainLabel Label of the first data in the dataset
   * @param {*} secondaryLabel Label of the second data in the dataset
   */
  setLabels(mainLabel, secondaryLabel) {
    this.labels = [mainLabel, secondaryLabel];
  }

  
  /**
   * Update the label with the easeOutQuad function
   * @param {float} from Initial value of the ratio
   * @param {float} to Final value of the ratio
   */
  updateValue(from, to) {
    // If there is an animation, increase percentage in the label
    if (!this.animation) {
      this.valueText.innerText = Math.round(100 * this.ratio);
      return;
    }

    // Count the iterations
    let counter = 0;
    let delta = to-from;
    // Start the timer
    let timer = setInterval(() => {
      counter++;
      if (counter >= 50) {
        // If the animation is over, set the final value and stop the timer
        this.valueText.innerText = Math.round(100 * this.ratio);
        clearInterval(timer);
      }
      else {
        let newValue = from + delta*this.easeOutQuad(counter/50);
        this.valueText.innerText = Math.round(100 * newValue);
      }
    }, 20)
  }

  /**
   * Easing function [ cubic-bezier(0.5, 1, 0.89, 1) ]
   * @param {float} x Absolute progress of the animation in the bounds of 0 (beginning of the animation) and 1 (end of animation).
   * @returns 
   */
  easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
  }

  /**
   * Callback function called before the tooltip is displayed
   * Must return the title of the tooltip
   * @param {object} tooltipItems The tooltip item provided by Chart.js
   * @returns The title of the tooltip
   */
  tooltipTitleCallback(tooltipItems) {

    return `${this.labels[tooltipItems[0].dataIndex]}`
  }

  /**
   * Callback function called before the tooltip is displayed
   * Must return the label of the tooltip
   * @param {object} tooltipItems The tooltip item provided by Chart.js
   * @returns The label of the tooltip
   */
  tooltipLabelCallback(tooltipItems) {
    if (tooltipItems.dataIndex == 0)
      return `${(this.ratio * 100).toFixed(2)}%`;
    else
      return `${((1 - this.ratio) * 100).toFixed(2)}%`;
  }

}