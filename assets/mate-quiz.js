/**
 * Basic checkmate recognition quiz — multiple choice, equal-length answers.
 * Requires board.js when a question includes a diagram.
 */
(function (global) {
  var QUESTIONS = [
    {
      prompt: 'White king on e2, queen on e3, Black king on a1. Is this checkmate?',
      pieces: { e2: 'wK', e3: 'wQ', a1: 'bK' },
      highlights: ['a1', 'e3'],
      choices: [
        'Yes — Black king is mated',
        'No — Black can still castle',
        'No — this is stalemate draw',
        'No — White lacks material',
      ],
      answer: 0,
      explain: 'The king on a1 has no legal square. Every escape is attacked by the queen.',
    },
    {
      prompt: 'White king on c6, queen on d8, Black king on a8. Is this checkmate?',
      pieces: { c6: 'wK', d8: 'wQ', a8: 'bK' },
      highlights: ['a8', 'd8', 'b7'],
      choices: [
        'No — king escapes to b7',
        'Yes — Black king is mated',
        'No — this is stalemate draw',
        'No — White lacks material',
      ],
      answer: 0,
      explain: 'Black is in check but b7 is free. Check is not the same as checkmate.',
    },
    {
      prompt: 'White rook on e4, king on e5, Black king on h8. Best move to start boxing the king?',
      pieces: { e4: 'wR', e5: 'wK', h8: 'bK' },
      highlights: ['e4', 'h8', 'e8'],
      choices: [
        'Re8 — cut off the rank',
        'Rh4 — shift the rook over',
        'Kf6 — bring the king in',
        'Ra4 — slide the rook away',
      ],
      answer: 0,
      explain: 'Re8 pins Black to the back rank. The rook and king work together to shrink the box.',
    },
    {
      prompt: 'White queen on a6, king on b6, Black king on a8. Which move avoids a stalemate trap?',
      pieces: { a6: 'wQ', b6: 'wK', a8: 'bK' },
      highlights: ['a6', 'a8', 'c8'],
      choices: [
        'Qc8 — check, not stalemate',
        'Qa8 — queen takes corner',
        'Qb7 — box the black king',
        'Ka6 — king steps closer',
      ],
      answer: 0,
      explain: 'Qa8 would stalemate — no legal moves, not in check. Give check with Qc8 instead.',
    },
    {
      prompt: 'White king on f6, queen on g6, Black king on h8. Is this checkmate?',
      pieces: { f6: 'wK', g6: 'wQ', h8: 'bK' },
      highlights: ['h8', 'g6'],
      choices: [
        'Yes — Black king is mated',
        'No — king escapes to g8',
        'No — this is stalemate draw',
        'No — White lacks material',
      ],
      answer: 0,
      explain: 'Every escape square around h8 is covered. The king is in check with no legal move.',
    },
    {
      prompt: 'When you are up a queen, what should you do first?',
      pieces: { d4: 'wQ', e4: 'wK', d6: 'bK' },
      highlights: ['d4', 'd6'],
      choices: [
        'Shrink the box — cut escapes',
        'Chase with checks — rush mate',
        'Trade queens — simplify fast',
        'Push pawns — promote first',
      ],
      answer: 0,
      explain: 'Restrict the enemy king with your queen before bringing your king in. Patience wins.',
    },
    {
      prompt: 'White king on e7, queen on f7, Black king on h8. Is this checkmate?',
      pieces: { e7: 'wK', f7: 'wQ', h8: 'bK' },
      highlights: ['h8', 'f7', 'g8'],
      choices: [
        'No — king escapes to g8',
        'Yes — Black king is mated',
        'No — this is stalemate draw',
        'No — White lacks material',
      ],
      answer: 0,
      explain: 'The queen is one square short. g8 is free — slide the queen to g7 or h6 to finish.',
    },
    {
      prompt: 'White rook on a5, king on e5, Black king on a8. Best move to box the king on the back rank?',
      pieces: { a5: 'wR', e5: 'wK', a8: 'bK' },
      highlights: ['a5', 'a8', 'a7'],
      choices: [
        'Ra7 — cut off the file',
        'Rh5 — slide along the rank',
        'Kf6 — bring the king in',
        'Rb5 — shift the rook over',
      ],
      answer: 0,
      explain: 'Ra7 traps the king on the a-file. Next, your king walks in and the rook delivers mate.',
    },
  ];

  function mountMateQuiz(mount, opts) {
    opts = opts || {};
    var count = opts.count != null ? opts.count : QUESTIONS.length;
    var passAt = opts.passAt != null ? opts.passAt : 6;

    mount.innerHTML =
      '<div id="mate-diagram" class="board-wrap" hidden></div>' +
      '<div class="quiz-panel">' +
        '<p class="quiz-prompt" id="mate-prompt"></p>' +
        '<ul class="choice-list" id="mate-choices"></ul>' +
        '<p class="quiz-feedback" id="mate-feedback"></p>' +
        '<p class="quiz-progress" id="mate-progress"></p>' +
        '<p class="quiz-score" id="mate-score" hidden></p>' +
        '<button class="btn" id="mate-next" hidden>Next question</button>' +
      '</div>';

    var diagramEl = mount.querySelector('#mate-diagram');
    var promptEl = mount.querySelector('#mate-prompt');
    var choicesEl = mount.querySelector('#mate-choices');
    var feedbackEl = mount.querySelector('#mate-feedback');
    var progressEl = mount.querySelector('#mate-progress');
    var scoreEl = mount.querySelector('#mate-score');
    var nextBtn = mount.querySelector('#mate-next');

    var board = global.ChessBoard;
    var index = 0;
    var correct = 0;
    var answered = false;

    function renderQuestion() {
      answered = false;
      feedbackEl.textContent = '';
      feedbackEl.className = 'quiz-feedback';
      nextBtn.hidden = true;
      choicesEl.innerHTML = '';

      if (index >= count) {
        diagramEl.hidden = true;
        promptEl.textContent = 'Quiz complete';
        progressEl.textContent = '';
        scoreEl.hidden = false;
        scoreEl.textContent =
          'Done — ' + correct + ' / ' + count + ' correct. ' +
          (correct >= passAt ? 'You see mates and near-misses.' : 'Review the lesson and run again.');
        return;
      }

      var q = QUESTIONS[index];
      promptEl.textContent = q.prompt;
      progressEl.textContent = 'Question ' + (index + 1) + ' of ' + count;

      if (q.pieces && board) {
        diagramEl.hidden = false;
        diagramEl.innerHTML = '<div id="mate-board" class="board-container"></div>';
        board.renderBoard(diagramEl.querySelector('#mate-board'), {
          pieces: q.pieces,
          highlights: q.highlights || [],
        });
      } else {
        diagramEl.hidden = true;
      }

      q.choices.forEach(function (text, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.addEventListener('click', function () { pick(i); });
        choicesEl.appendChild(btn);
      });
    }

    function pick(choice) {
      if (answered || index >= count) return;
      answered = true;
      var q = QUESTIONS[index];
      var buttons = choicesEl.querySelectorAll('.choice-btn');

      buttons.forEach(function (btn, i) {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === choice && choice !== q.answer) btn.classList.add('wrong');
      });

      if (choice === q.answer) {
        correct++;
        feedbackEl.textContent = 'Correct. ' + q.explain;
        feedbackEl.className = 'quiz-feedback correct';
      } else {
        feedbackEl.textContent = 'Not quite. ' + q.explain;
        feedbackEl.className = 'quiz-feedback wrong';
      }

      index++;
      nextBtn.hidden = false;
    }

    nextBtn.addEventListener('click', renderQuestion);
    renderQuestion();
  }

  global.MateQuiz = { mount: mountMateQuiz, QUESTIONS: QUESTIONS };
})(window);
