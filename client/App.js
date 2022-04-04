import React from 'react';
import ReactDOM from 'react-dom';
import Pet from './Pet';

const App = () => {
  return React.createElement('div', {}, [
    React.createElement('h1', {}, 'BookBee'),
    React.createElement(Pet, {
      name: 'Luna',
      animal: 'dog',
      breed: 'Havanese'
    }),
    React.createElement(Pet, {
      name: 'Pepper',
      animal: 'bird',
      breed: 'Cockatiel'
    }),
    React.createElement(Pet, {
      name: 'Sudo',
      animal: 'dog',
      breed: 'Wheaten Terrier'
    })
  ]);
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));
