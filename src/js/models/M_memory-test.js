

class M_MemoryTest {

  constructor() {

    // Meta data of the quizzes
    this.metaData = [];

    // Array of questions
    this.questions = [];
  }




  getNextQuestion() {
    
    let index = Math.floor(Math.random() * this.questions.length);
    let nextQuestion = this.questions[index];
    nextQuestion.flag = this.metaData[nextQuestion.path].flag;
    return nextQuestion;
  }



  /**
   * Load a quiz and return a promise when the file is loaded and append to the list
   * testPath must start and end with /, ie : /fr/grec/alphabet/
   * @param {string} quizPath - Path of the quiz folder
   * @returns A promise resolved when the quiz is loaded
   */
  addQuiz(quizPath) {

    // Return a promise when the quiz is loaded
    return new Promise((resolve, reject) => {

      // Check of the quiz already exists, if so do not load the quiz twice
      if (this.metaData[quizPath] !== undefined) { resolve(); return;}

      // This is a new quiz, add entry in meta data
      this.metaData[quizPath] = {};

      // Import the required typing test
      import('../../quizzes' + quizPath + 'index.js')
        .then((quiz) => {

          // Check of the quiz has not been deleted in the meantime
          if (this.metaData[quizPath] === undefined) { resolve(); return;}

          // Update the quiz meta data 
          this.metaData[quizPath] = quiz.metaData;

          // Add the path to each question (path is also the reference to the meta data index)
          quiz.questions.map((q) => { 
            q.path = quizPath; 
            q.rawAnswer = q.answer;
          });

          // Append the questions to the list
          this.questions = this.questions.concat(quiz.questions);
          resolve();
        })
        .catch((error) => {

          // The quiz has not been loaded, delete the meta data related to the current quiz
          delete this.metaData[quizPath];

          // Reject the promise
          reject(error);
        })

    })

  }


  /**
   * Remove a quiz from the current list of quizzes
   * @param {string} quizPath path to the quiz to delete
   */
  removeQuiz(quizPath) {
    // Delete meta data first to prevent asynchronous operation in the mean time
    delete this.metaData[quizPath];

    // Remove the questions
    this.questions = this.questions.filter(q => q.path !== quizPath);    
  }





}


export default new M_MemoryTest();