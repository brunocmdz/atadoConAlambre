import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/homePrivate.css';

const HomePrivate = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [area, setArea] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para la funcionalidad de eliminación con checkboxes
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Cargar elementos al montar el componente
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error al obtener elementos:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !cantidad.trim() || !area.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/items', {
        nombre,
        cantidad,
        area
      });

      setItems([...items, response.data]);
      setNombre('');
      setCantidad('');
      setArea('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error al guardar el elemento:', error);
    }
  };

  const handleCancel = () => {
    setNombre('');
    setCantidad('');
    setArea('');
    setShowAddForm(false);
  };

  // Alternar la selección de un checkbox individual
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Alternar el modo de eliminación
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedIds([]); // Limpiar selecciones al entrar o salir
  };

  // Confirmar y ejecutar la eliminación en la BD
  const handleConfirmDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Por favor, seleccioná al menos un elemento para eliminar.');
      return;
    }

    try {
      await axios.delete('http://localhost:3000/items', {
        data: { ids: selectedIds }
      });

      // Actualizar el estado filtrando los elementos eliminados
      setItems(items.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('Error al eliminar los elementos:', error);
    }
  };

  // Filtrar los elementos según lo que se escriba en la barra de búsqueda
  const filteredItems = items.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-private-container">
      <div className="home-private-section">
        <h2>Herramientas y Materiales</h2>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar por nombre o área..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-buttons-wrapper">
            <button type="button" className="upload-btn">Buscar</button>
            <button 
              type="button" 
              className="upload-btn" 
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (isDeleteMode) setIsDeleteMode(false);
              }}
            >
              {showAddForm ? 'Cerrar' : 'Agregar'}
            </button>
            <button 
              type="button" 
              className={`upload-btn ${isDeleteMode ? '' : 'delete-btn'}`}
              onClick={toggleDeleteMode}
            >
              {isDeleteMode ? 'Cancelar' : 'Eliminar'}
            </button>

            {isDeleteMode && (
              <button 
                type="button" 
                className="upload-btn delete-btn"
                onClick={handleConfirmDelete}
              >
                Confirmar selección ({selectedIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Formulario desplegable para agregar */}
        {showAddForm && (
          <form className="add-form-container" onSubmit={handleSave}>
            <div className="form-group">
              <label>Nombre:</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                placeholder="Ej. Llave inglesa" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Cantidad:</label>
              <input 
                type="text" 
                value={cantidad} 
                onChange={(e) => setCantidad(e.target.value)} 
                placeholder="Ej. 5" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Área:</label>
              <input 
                type="text" 
                value={area} 
                onChange={(e) => setArea(e.target.value)} 
                placeholder="Ej. Depósito A" 
                required 
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="upload-btn">Guardar</button>
              <button type="button" className="upload-btn delete-btn" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        )}

        {/* Tabla de registros */}
        <div className="records-table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                {isDeleteMode && <th>Seleccionar</th>}
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={isDeleteMode ? 5 : 4} className="empty-table-msg">
                    No se encontraron elementos guardados.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    {isDeleteMode && (
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                    )}
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.area}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default HomePrivate;