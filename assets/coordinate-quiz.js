/**
 * Coordinate-finding quiz — requires board.js loaded first.
 */
(function (global) {
  var board = global.ChessBoard;

  function mountCoordinateQuiz(mount, opts) {
    opts = opts || {};
    var count = opts.count != null ? opts.count : 10;
    var orientation = opts.orientation || 'white';

    mount.innerHTML =
      '<div class="board-wrap"><div id="quiz-board"></div></div>' +
      '<div class="quiz-panel">' +
        '<p class="quiz-prompt">Click the square: <code id="quiz-target">—</code></p>' +
        '<p class="quiz-feedback" id="quiz-feedback"></p>' +
        '<p class="quiz-progress" id="quiz-progress"></p>' +
        '<p class="quiz-score" id="quiz-score" hidden></p>' +
        '<button class="btn" id="quiz-next" hidden>Next question</button>' +
      '</div>';

    var boardEl = mount.querySelector('#quiz-board');
    var targetEl = mount.querySelector('#quiz-target');
    var feedbackEl = mount.querySelector('#quiz-feedback');
    var progressEl = mount.querySelector('#quiz-progress');
    var scoreEl = mount.querySelector('#quiz-score');
    var nextBtn = mount.querySelector('#quiz-next');

    var current = 0;
    var correct = 0;
    var target = '';
    var answered = false;
    var used = new Set();

    function nextQuestion() {
      answered = false;
      board.clearMarks(boardEl);
      feedbackEl.textContent = '';
      feedbackEl.className = 'quiz-feedback';
      nextBtn.hidden = true;

      if (current >= count) {
        scoreEl.hidden = false;
        scoreEl.textContent =
          'Done — ' + correct + ' / ' + count + ' correct. ' +
          (correct >= 8 ? 'Solid. You read the board.' : 'Run it again until you hit 8+.');
        targetEl.textContent = '—';
        progressEl.textContent = '';
        return;
      }

      target = board.randomSquare(used);
      used.add(target);
      targetEl.textContent = target;
      progressEl.textContent = 'Question ' + (current + 1) + ' of ' + count;
    }

    board.renderBoard(boardEl, {
      clickable: true,
      orientation: orientation,
      onSquareClick: function (sq) {
        if (answered || current >= count) return;
        answered = true;
        board.clearMarks(boardEl);

        if (sq === target) {
          correct++;
          board.markSquare(boardEl, sq, 'correct');
          feedbackEl.textContent = 'Correct.';
          feedbackEl.className = 'quiz-feedback correct';
        } else {
          board.markSquare(boardEl, sq, 'wrong');
          board.markSquare(boardEl, target, 'correct');
          feedbackEl.textContent = 'That was ' + sq + '. The answer is ' + target + '.';
          feedbackEl.className = 'quiz-feedback wrong';
        }

        current++;
        nextBtn.hidden = false;
      },
    });

    nextBtn.addEventListener('click', nextQuestion);
    nextQuestion();
  }

  global.CoordinateQuiz = { mount: mountCoordinateQuiz };
})(window);
