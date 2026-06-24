/**
 * Chess board renderer — works without a web server (no ES modules).
 */
(function (global) {
  var PIECE_CHARS = {
    wK: '\u2654', wQ: '\u2655', wR: '\u2656', wB: '\u2657', wN: '\u2658', wP: '\u2659',
    bK: '\u265A', bQ: '\u265B', bR: '\u265C', bB: '\u265D', bN: '\u265E', bP: '\u265F',
  };

  function spacer() {
    return document.createElement('div');
  }

  function label(text, cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.textContent = text;
    return el;
  }

  function renderBoard(container, opts) {
    opts = opts || {};
    const clickable = opts.clickable || false;
    const orientation = opts.orientation || 'white';
    const onSquareClick = opts.onSquareClick;
    const highlight = opts.highlight;
    const highlights = opts.highlights || (highlight ? [highlight] : []);
    const pieces = opts.pieces || {};
    const files = orientation === 'white'
      ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
      : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
    const ranks = orientation === 'white'
      ? [8, 7, 6, 5, 4, 3, 2, 1]
      : [1, 2, 3, 4, 5, 6, 7, 8];

    container.innerHTML = '';
    container.className = 'board-container';

    container.appendChild(spacer());
    for (let i = 0; i < files.length; i++) container.appendChild(label(files[i], 'board-file'));
    container.appendChild(spacer());

    for (let r = 0; r < 8; r++) {
      container.appendChild(label(String(ranks[r]), 'board-rank'));

      for (let f = 0; f < 8; f++) {
        const sq = files[f] + ranks[r];
        const isLight = (f + r) % 2 === 0;
        const sqEl = document.createElement('div');
        sqEl.className = 'square ' + (isLight ? 'light' : 'dark');
        sqEl.dataset.square = sq;
        if (highlights.indexOf(sq) !== -1) sqEl.classList.add('highlight');
        if (pieces[sq]) {
          var pieceEl = document.createElement('span');
          pieceEl.className = 'piece';
          pieceEl.textContent = PIECE_CHARS[pieces[sq]] || '';
          pieceEl.setAttribute('aria-hidden', 'true');
          sqEl.appendChild(pieceEl);
        }
        if (clickable) {
          sqEl.classList.add('clickable');
          sqEl.addEventListener('click', function () {
            if (onSquareClick) onSquareClick(sq);
          });
        }
        container.appendChild(sqEl);
      }

      container.appendChild(label(String(ranks[r]), 'board-rank'));
    }

    container.appendChild(spacer());
    for (let j = 0; j < files.length; j++) container.appendChild(label(files[j], 'board-file'));
    container.appendChild(spacer());
  }

  function markSquare(container, sq, state) {
    const el = container.querySelector('[data-square="' + sq + '"]');
    if (!el) return;
    el.classList.remove('highlight', 'correct', 'wrong');
    if (state) el.classList.add(state);
  }

  function clearMarks(container) {
    container.querySelectorAll('.square').forEach(function (el) {
      el.classList.remove('highlight', 'correct', 'wrong');
    });
  }

  function randomSquare(exclude) {
    exclude = exclude || new Set();
    const fileChars = 'abcdefgh';
    let sq;
    do {
      sq = fileChars[Math.floor(Math.random() * 8)] + (Math.floor(Math.random() * 8) + 1);
    } while (exclude.has(sq));
    return sq;
  }

  global.ChessBoard = {
    PIECE_CHARS: PIECE_CHARS,
    renderBoard: renderBoard,
    markSquare: markSquare,
    clearMarks: clearMarks,
    randomSquare: randomSquare,
  };
})(window);
