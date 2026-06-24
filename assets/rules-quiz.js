/**
 * Rules & special-moves quiz — multiple choice, equal-length answers.
 * Requires board.js when a question includes a diagram.
 */
(function (global) {
  var QUESTIONS = [
    {
      prompt: 'White king on e1, rook on h1, clear path, neither piece has moved, king not in check. Can White castle kingside?',
      pieces: {
        e1: 'wK', h1: 'wR', e8: 'bK', a8: 'bR',
      },
      highlights: ['e1', 'h1', 'f1', 'g1'],
      choices: [
        'Yes — castling is fully legal',
        'No — king currently in check',
        'No — the rook is attacked',
        'No — the king has moved',
      ],
      answer: 0,
      explain: 'Kingside castling (O-O) is legal. A rook under attack does not forbid castling.',
    },
    {
      prompt: 'Same setup, but a Black bishop attacks f1. Can White still castle kingside?',
      pieces: {
        e1: 'wK', h1: 'wR', e8: 'bK', c4: 'bB',
      },
      highlights: ['f1'],
      choices: [
        'No — king crosses attacked square',
        'Yes — castling is fully legal',
        'No — king currently in check',
        'No — the rook is attacked',
      ],
      answer: 0,
      explain: 'The king may not castle through a square attacked by an enemy piece — even f1.',
    },
    {
      prompt: 'White pawn on e5; Black just played …d7–d5 (two squares). Can White capture en passant on d6?',
      pieces: {
        e5: 'wP', d5: 'bP', e1: 'wK', e8: 'bK',
      },
      highlights: ['e5', 'd5', 'd6'],
      choices: [
        'Yes — capture en passant now',
        'No — wait until next turn',
        'No — pawns can never capture',
        'No — only diagonal captures apply',
      ],
      answer: 0,
      explain: 'En passant must be played immediately after the two-square pawn push.',
    },
    {
      prompt: 'Black king on a8, Black pawn on a7, White king on c6. Black to move — what is the result?',
      pieces: {
        a8: 'bK', a7: 'bP', c6: 'wK',
      },
      highlights: ['a8', 'a7'],
      choices: [
        'Draw — Black is stalemated',
        'Win — White delivers mate',
        'Loss — Black loses pawn',
        'Draw — not enough material',
      ],
      answer: 0,
      explain: 'Stalemate: side to move has no legal move and is not in check. The game is a draw.',
    },
    {
      prompt: 'White pawn reaches h8 with no check. Which promotion is NOT allowed?',
      pieces: {
        h8: 'wP', g7: 'wK', g8: 'bK',
      },
      highlights: ['h8'],
      choices: [
        'Promote the pawn to king',
        'Promote the pawn to queen',
        'Promote the pawn to knight',
        'Promote the pawn to bishop',
      ],
      answer: 0,
      explain: 'On promotion you may choose queen, rook, bishop, or knight — never a second king.',
    },
    {
      prompt: 'White king on e1 is in check from a Black queen on e8. White tries Ke2. What happened?',
      pieces: {
        e1: 'wK', e8: 'bQ', d1: 'wR',
      },
      highlights: ['e8', 'e2'],
      choices: [
        'Illegal — king moves into check',
        'Legal — king escaped the check',
        'Draw — threefold repetition applies',
        'Win — White has won game',
      ],
      answer: 0,
      explain: 'You cannot move into check. e2 is attacked by the queen on e8.',
    },
    {
      prompt: 'In a tournament, you touch your knight but then play a pawn move instead. What should happen?',
      pieces: {
        e4: 'wP', g1: 'wN', e5: 'bP', e8: 'bK', e1: 'wK',
      },
      choices: [
        'Move the touched knight piece',
        'Allow the pawn move anyway',
        'Take back both touched pieces',
        'Declare an immediate forfeit',
      ],
      answer: 0,
      explain: 'Touch-move: if you touch a piece you can move, you must move it (if legal).',
    },
    {
      prompt: 'White king on g1, rook on f1, clear path, neither has moved. Can White castle kingside?',
      pieces: {
        g1: 'wK', f1: 'wR', e8: 'bK', h8: 'bR',
      },
      highlights: ['g1', 'f1', 'h1'],
      choices: [
        'No — king left starting square',
        'Yes — castling is fully legal',
        'No — king currently in check',
        'No — the rook is attacked',
      ],
      answer: 0,
      explain: 'After moving the king, castling rights are lost — even if the king returns.',
    },
  ];

  function mountRulesQuiz(mount, opts) {
    opts = opts || {};
    var count = opts.count != null ? opts.count : QUESTIONS.length;
    var passAt = opts.passAt != null ? opts.passAt : 6;

    mount.innerHTML =
      '<div id="rules-diagram" class="board-wrap" hidden></div>' +
      '<div class="quiz-panel">' +
        '<p class="quiz-prompt" id="rules-prompt"></p>' +
        '<ul class="choice-list" id="rules-choices"></ul>' +
        '<p class="quiz-feedback" id="rules-feedback"></p>' +
        '<p class="quiz-progress" id="rules-progress"></p>' +
        '<p class="quiz-score" id="rules-score" hidden></p>' +
        '<button class="btn" id="rules-next" hidden>Next question</button>' +
      '</div>';

    var diagramEl = mount.querySelector('#rules-diagram');
    var promptEl = mount.querySelector('#rules-prompt');
    var choicesEl = mount.querySelector('#rules-choices');
    var feedbackEl = mount.querySelector('#rules-feedback');
    var progressEl = mount.querySelector('#rules-progress');
    var scoreEl = mount.querySelector('#rules-score');
    var nextBtn = mount.querySelector('#rules-next');

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
          (correct >= passAt ? 'You know the edge cases.' : 'Review the lesson and run again.');
        return;
      }

      var q = QUESTIONS[index];
      promptEl.textContent = q.prompt;
      progressEl.textContent = 'Question ' + (index + 1) + ' of ' + count;

      if (q.pieces && board) {
        diagramEl.hidden = false;
        diagramEl.innerHTML = '<div id="rules-board" class="board-container"></div>';
        board.renderBoard(diagramEl.querySelector('#rules-board'), {
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

  global.RulesQuiz = { mount: mountRulesQuiz, QUESTIONS: QUESTIONS };
})(window);
