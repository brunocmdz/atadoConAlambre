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

  // Estados para eliminación
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Estados para edición
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nombre: '', cantidad: '', area: '' });

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

  // Alternar selección para eliminación
  const handleCheckboxChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Modos de vista
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsEditMode(false);
    setSelectedIds([]);
    setEditingId(null);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsDeleteMode(false);
    setSelectedIds([]);
    setEditingId(null);
  };

  // Seleccionar ítem a editar mediante checkbox
  const handleEditCheckboxChange = (item) => {
    if (editingId === item.id) {
      setEditingId(null);
      setEditFormData({ nombre: '', cantidad: '', area: '' });
    } else {
      setEditingId(item.id);
      setEditFormData({ nombre: item.nombre, cantidad: item.cantidad, area: item.area });
    }
  };

  // Confirmar y guardar la edición
  const handleConfirmEdit = async () => {
    if (!editingId) {
      alert('Por favor, seleccioná un elemento para editar.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/items/${editingId}`, editFormData);

      setItems(items.map((item) => (item.id === editingId ? response.data : item)));
      setEditingId(null);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error al editar el elemento:', error);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (selectedIds.length === 0) {
      alert('Por favor, seleccioná al menos un elemento para eliminar.');
      return;
    }

    try {
      await axios.delete('http://localhost:3000/items', {
        data: { ids: selectedIds }
      });

      setItems(items.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('Error al eliminar los elementos:', error);
    }
  };

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
                setIsDeleteMode(false);
                setIsEditMode(false);
              }}
            >
              {showAddForm ? 'Cerrar' : 'Agregar'}
            </button>

            <button 
              type="button" 
              className={`upload-btn ${isEditMode ? '' : 'edit-btn'}`}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Cancelar' : 'Editar'}
            </button>

            {isEditMode && (
              <button 
                type="button" 
                className="upload-btn"
                onClick={handleConfirmEdit}
              >
                Confirmar edición
              </button>
            )}

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

        {/* Formulario para agregar */}
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
                {(isDeleteMode || isEditMode) && <th>Seleccionar</th>}
                <th>ID</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={(isDeleteMode || isEditMode) ? 5 : 4} className="empty-table-msg">
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

                    {isEditMode && (
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={editingId === item.id}
                          onChange={() => handleEditCheckboxChange(item)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                    )}

                    <td>{item.id}</td>

                    {/* Mostrar campos de texto editables si el ítem está seleccionado para editar */}
                    {isEditMode && editingId === item.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            className="search-input"
                            value={editFormData.nombre} 
                            onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="search-input"
                            value={editFormData.cantidad} 
                            onChange={(e) => setEditFormData({ ...editFormData, cantidad: e.target.value })} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            className="search-input"
                            value={editFormData.area} 
                            onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })} 
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.area}</td>
                      </>
                    )}
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