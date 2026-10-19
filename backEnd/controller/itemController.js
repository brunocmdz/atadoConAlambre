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

module.exports = {
  getItems,
  createItem
};