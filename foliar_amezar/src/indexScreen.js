import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IndexMenu from './IndexMenu';

function Index({ indexOptions }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMenuVisible, setMenuVisibility] = useState(false);

  const toggleMenu = () => {
    setMenuVisibility(!isMenuVisible);
  };

  const groupedOptions = groupByInitialLetter(indexOptions);

  const filteredOptions = Object.keys(groupedOptions)
    .reduce((result, initial) => {
      const matchingOptions = groupedOptions[initial]
        .filter((option) =>
          option.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!selectedCategory || option.category === selectedCategory)
        );

      if (matchingOptions.length > 0) {
        result[initial] = matchingOptions;
      }

      return result;
    }, {});

  const categories = [...new Set(indexOptions.map((option) => option.category))];

  return (
    <div>
      <div className='index-header' >
        <img className='menu-icon' src='menuIcon.png' onClick={toggleMenu}></img>
        <Link to={'/ayuda'} className='help-link'><img className='help-icon' src='helpIcon.png'></img></Link> 
        {/* Pasa el estado y la función de devolución de llamada como props al menú */}
        <IndexMenu categories={categories} isMenuVisible={isMenuVisible} toggleMenu={toggleMenu} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className='index'>

        <div className={`content ${isMenuVisible ? 'blurred' : ''}`}>
          <input
            className='search-bar'
            type="text"
            placeholder="Escriba aquí el cultivo a buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className='index-content'>
            {Object.keys(filteredOptions).map((initial) => (
              <div key={initial}>
                <h3 className='section-header'>{initial}</h3>
                <ul className='index-list'>
                  {filteredOptions[initial].map((option) => (
                    <li key={option.name}>
                      <Link to={`/${option.category}/${option.name}`}>
                        <p>{option.name}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        </div>
    </div>
  );
}

function groupByInitialLetter(itemsList) {
  return itemsList.reduce((grouped, item) => {
    const initial = item.name.charAt(0).toUpperCase();
    grouped[initial] = grouped[initial] || [];
    grouped[initial].push(item);
    return grouped;
  }, {});
}

export default Index;
