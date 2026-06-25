/**
 * Basic tactics recognition quiz — forks, pins, loose pieces.
 * Requires board.js when a question includes a diagram.
 */
(function (global) {
  var QUESTIONS = [
    {
      prompt: 'White knight on f7 attacks Black king on e8 and queen on d8. What tactic is this?',
      pieces: { f7: 'wN', e8: 'bK', d8: 'bQ', e1: 'wK' },
      highlights: ['f7', 'e8', 'd8'],
      choices: [
        'A fork — two targets hit',
        'A pin — piece tied down',
        'A skewer — line through king',
        'A trap — stalemate threat',
      ],
      answer: 0,
      explain: 'One knight move attacks king and queen at once. The king must move; you often win the queen.',
    },
    {
      prompt: 'White bishop on g5 pins Black knight on f6 to the king on e8. What defines a pin?',
      pieces: { g5: 'wB', f6: 'bN', e8: 'bK', e1: 'wK', d2: 'wP' },
      highlights: ['g5', 'f6', 'e8'],
      choices: [
        'Piece cannot move safely',
        'Two pieces attacked at once',
        'King has no legal move',
        'Pawn captures en passant',
      ],
      answer: 0,
      explain: 'The knight cannot leave f6 without exposing the king to the bishop. That is a pin.',
    },
    {
      prompt: 'White queen on c4 attacks undefended rook on a2. What should White play?',
      pieces: { c4: 'wQ', a2: 'bR', e8: 'bK', e1: 'wK' },
      highlights: ['c4', 'a2'],
      choices: [
        'Qxa2 — take loose rook',
        'Qe6 — check the king',
        'Qf7 — push toward mate',
        'Qb5 — retreat the queen',
      ],
      answer: 0,
      explain: 'The rook has no defender. Taking it wins material with no tactics required.',
    },
    {
      prompt: 'White knight on e5 attacks king on d7 and rook on c6. Best description?',
      pieces: { e5: 'wN', d7: 'bK', c6: 'bR', e1: 'wK' },
      highlights: ['e5', 'd7', 'c6'],
      choices: [
        'Fork — king and rook hit',
        'Pin — rook shields king',
        'Skewer — rook blocks king',
        'Draw — stalemate on board',
      ],
      answer: 0,
      explain: 'Knights excel at forks because they jump — two targets, one move.',
    },
    {
      prompt: 'Before every move, what scan finds tactics fastest at your level?',
      pieces: { d4: 'wQ', e5: 'bN', e8: 'bK', e1: 'wK' },
      highlights: ['e5'],
      choices: [
        'Loose pieces — undefended targets',
        'Castling rights — both sides',
        'Pawn structure — doubled pawns',
        'Clock time — remaining minutes',
      ],
      answer: 0,
      explain: 'At 415 Elo, most tactics start with a piece that nobody defends. Look for those first.',
    },
    {
      prompt: 'White rook on e1 eyes Black knight on e4 with no defender. What tactic type?',
      pieces: { e1: 'wR', e4: 'bN', e8: 'bK', e5: 'wP', e6: 'bP' },
      highlights: ['e1', 'e4'],
      choices: [
        'Loose piece — take material',
        'Fork — two pieces attacked',
        'Pin — knight tied to king',
        'Mate — king has no escape',
      ],
      answer: 0,
      explain: 'Re4 wins the knight. No combination needed — the piece was simply left hanging.',
    },
    {
      prompt: 'White bishop on b5 pins knight on c6 to king on e8. Can the knight legally move?',
      pieces: { b5: 'wB', c6: 'bN', e8: 'bK', e1: 'wK' },
      highlights: ['b5', 'c6', 'e8'],
      choices: [
        'No — king would be exposed',
        'Yes — knight jumps freely',
        'No — knight is checkmated',
        'Yes — pin only affects pawns',
      ],
      answer: 0,
      explain: 'Absolute pin to the king: moving the knight puts the king in check, which is illegal.',
    },
    {
      prompt: 'You are up material but keep missing wins. What daily habit helps most?',
      pieces: { f3: 'wN', d5: 'bQ', e8: 'bK', e1: 'wK' },
      highlights: ['f3', 'd5'],
      choices: [
        'Fifteen minutes — tactics puzzles',
        'Fifteen minutes — opening lines',
        'Fifteen minutes — bullet games',
        'Fifteen minutes — endgame theory',
      ],
      answer: 0,
      explain: 'Phase 1 study is ~70% tactics. Puzzles train the scan: loose pieces, forks, pins.',
    },
  ];

  function mountTacticsQuiz(mount, opts) {
    opts = opts || {};
    var count = opts.count != null ? opts.count : QUESTIONS.length;
    var passAt = opts.passAt != null ? opts.passAt : 6;

    mount.innerHTML =
      '<div id="tactics-diagram" class="board-wrap" hidden></div>' +
      '<div class="quiz-panel">' +
        '<p class="quiz-prompt" id="tactics-prompt"></p>' +
        '<ul class="choice-list" id="tactics-choices"></ul>' +
        '<p class="quiz-feedback" id="tactics-feedback"></p>' +
        '<p class="quiz-progress" id="tactics-progress"></p>' +
        '<p class="quiz-score" id="tactics-score" hidden></p>' +
        '<button class="btn" id="tactics-next" hidden>Next question</button>' +
      '</div>';

    var diagramEl = mount.querySelector('#tactics-diagram');
    var promptEl = mount.querySelector('#tactics-prompt');
    var choicesEl = mount.querySelector('#tactics-choices');
    var feedbackEl = mount.querySelector('#tactics-feedback');
    var progressEl = mount.querySelector('#tactics-progress');
    var scoreEl = mount.querySelector('#tactics-score');
    var nextBtn = mount.querySelector('#tactics-next');

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
          (correct >= passAt ? 'You spot forks, pins, and loose pieces.' : 'Review the lesson and run again.');
        return;
      }

      var q = QUESTIONS[index];
      promptEl.textContent = q.prompt;
      progressEl.textContent = 'Question ' + (index + 1) + ' of ' + count;

      if (q.pieces && board) {
        diagramEl.hidden = false;
        diagramEl.innerHTML = '<div id="tactics-board" class="board-container"></div>';
        board.renderBoard(diagramEl.querySelector('#tactics-board'), {
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

  global.TacticsQuiz = { mount: mountTacticsQuiz, QUESTIONS: QUESTIONS };
})(window);
