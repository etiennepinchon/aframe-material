const Layouts = {
  numerical: [
    { type: 'text', value: '1'},
    { type: 'text', value: '2'},
    { type: 'text', value: '3'},
    { type: 'text', value: '4'},
    { type: 'text', value: '5'},
    { type: 'text', value: '6'},
    { type: 'text', value: '7'},
    { type: 'text', value: '8'},
    { type: 'text', value: '9'},
    { type: 'text', value: '.'},
    { type: 'text', value: '0'},
    { type: 'text', value: '-'}
  ],

  alphabetical: [
    { type: 'text', value: 'q'},
    { type: 'text', value: 'w'},
    { type: 'text', value: 'e'},
    { type: 'text', value: 'r'},
    { type: 'text', value: 't'},
    { type: 'text', value: 'y'},
    { type: 'text', value: 'u'},
    { type: 'text', value: 'i'},
    { type: 'text', value: 'o'},
    { type: 'text', value: 'p'},

    { type: 'text', value: 'a'},
    { type: 'text', value: 's'},
    { type: 'text', value: 'd'},
    { type: 'text', value: 'f'},
    { type: 'text', value: 'g'},
    { type: 'text', value: 'h'},
    { type: 'text', value: 'j'},
    { type: 'text', value: 'k'},
    { type: 'text', value: 'l'},

    { type: 'shift'},
    { type: 'text', value: 'z'},
    { type: 'text', value: 'x'},
    { type: 'text', value: 'c'},
    { type: 'text', value: 'v'},
    { type: 'text', value: 'b'},
    { type: 'text', value: 'n'},
    { type: 'text', value: 'm'},
    { type: 'text', value: '!'},
    { type: 'text', value: '?'},

    { type: 'symbol', value: '#+='},
    { type: 'text', value: '@'},
    { type: 'spacebar', value: ''},
    { type: 'text', value: ','},
    { type: 'text', value: '.'}
  ],

  symbols: [
    { type: 'text', value: '@'},
    { type: 'text', value: '#'},
    { type: 'text', value: '$'},
    { type: 'text', value: '%'},
    { type: 'text', value: '&'},
    { type: 'text', value: '*'},
    { type: 'text', value: '-'},
    { type: 'text', value: '+'},
    { type: 'text', value: '('},
    { type: 'text', value: ')'},

    { type: 'text', value: '~'},
    { type: 'text', value: '`'},
    { type: 'text', value: '"'},
    { type: 'text', value: '\''},
    { type: 'text', value: ':'},
    { type: 'text', value: ';'},
    { type: 'text', value: '_'},
    { type: 'text', value: '='},
    { type: 'text', value: '\\'},
    { type: 'text', value: '/'},

    { type: 'text', value: '{'},
    { type: 'text', value: '}'},
    { type: 'text', value: '['},
    { type: 'text', value: ']'},
    { type: 'text', value: '<'},
    { type: 'text', value: '>'},
    { type: 'text', value: '^'},
    { type: 'text', value: '|'},
    { type: 'text', value: '!'},
    { type: 'text', value: '?'},

    { type: 'symbol', value: 'ABC'},
    { type: 'text', value: '@'},
    { type: 'spacebar', value: ''},
    { type: 'text', value: ','},
    { type: 'text', value: '.'}
  ],

  actions: [
    { type: 'backspace', value: 'Del'},
    { type: 'enter', value: 'OK'},
    { type: 'dismiss', value: 'W'},
  ]
}

module.exports = Layouts;
