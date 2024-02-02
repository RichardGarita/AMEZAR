// Menu.js
import React from 'react';

const IndexMenu = ({ categories, isMenuVisible, toggleMenu, setSelectedCategory }) => {
    const handleCategoryClick = (category) => {
      setSelectedCategory(category);
      toggleMenu(); // Cierra el menú al seleccionar una categoría
    };

    let colorIndex = -1;

    const getColorForIndex = () => {
      colorIndex++;
      return colorIndex % 2 === 0 ? '#90DD84' : '#1BA505'; // Colores alternativos
    };

  return (
    <div className={`menu ${isMenuVisible ? 'visible' : 'hidden'}`}>
        <h3>Categorías</h3>
        <ul>
          {
          categories.map((category, ) => (
            <li
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{ backgroundColor: getColorForIndex() }}
            >
              {category}
            </li>
          ))}
          <li onClick={() => handleCategoryClick(null)} style={{ backgroundColor: getColorForIndex() }}>Mostrar Todos</li>
        </ul>
    </div>
  );
};

export default IndexMenu;
