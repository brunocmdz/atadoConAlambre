const Item = require('../model/item');

// Obtener todos los elementos
const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los elementos' });
  }
};

// Crear un nuevo elemento
const createItem = async (req, res) => {
  try {
    const { nombre, cantidad, area } = req.body;
    const newItem = await Item.create({ nombre, cantidad, area });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el elemento' });
  }
};

// Eliminar múltiples elementos
const deleteItems = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar una lista de IDs para eliminar' });
    }

    await Item.destroy({
      where: {
        id: ids
      }
    });

    res.json({ message: 'Elementos eliminados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar los elementos' });
  }
};

// Actualizar un elemento
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cantidad, area } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Elemento no encontrado' });
    }

    item.nombre = nombre;
    item.cantidad = cantidad;
    item.area = area;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el elemento' });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItems,
  updateItem
};