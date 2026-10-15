import React, { useState } from 'react';
import './styles/homePrivate.css';

const HomePrivate = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [area, setArea] = useState('');
  const [items, setItems] = useState([]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !cantidad.trim() || !area.trim()) return;

    const newItem = {
      id: items.length + 1,
      nombre,
      cantidad,
      area
    };

    setItems([...items, newItem]);
    setNombre('');
    setCantidad('');
    setArea('');
    setShowAddForm(false);
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
                  <td colSpan="4" className="empty-table-msg">No hay elementos agregados todavía.</td>
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