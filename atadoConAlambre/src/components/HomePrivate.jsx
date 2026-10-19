import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/homePrivate.css';

const HomePrivate = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [area, setArea] = useState('');
  const [items, setItems] = useState([]);

  // Cargar elementos al cargar el componente
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

  return (
    <div className="home-private-container">
      <div className="home-private-section">
        <h2>Herramientas y Materiales</h2>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="search-input"
          />
          <div className="search-buttons-wrapper">
            <button type="button" className="upload-btn">Buscar</button>
            <button 
              type="button" 
              className="upload-btn" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cerrar' : 'Agregar'}
            </button>
            <button type="button" className="upload-btn delete-btn">Eliminar</button>
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
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-msg">No hay elementos guardados en la base de datos.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
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