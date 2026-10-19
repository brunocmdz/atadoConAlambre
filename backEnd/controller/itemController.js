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
    const { ids } = req.body; // Se espera un array de IDs, por ejemplo: [1, 2]
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

module.exports = {
  getItems,
  createItem,
  deleteItems
};