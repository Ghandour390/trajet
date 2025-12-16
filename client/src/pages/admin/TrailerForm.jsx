import React, { useState, useEffect } from 'react';

const initialState = {
  plateNumber: '',
  type: 'Frigorifique',
  brand: '',
  model: '',
  year: '',
  capacity: '',
  currentKm: 0,
};

function TrailerForm({ trailer, onSave, onClose }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (trailer) {
      setFormData({
        plateNumber: trailer.plateNumber || '',
        type: trailer.type || 'Frigorifique',
        brand: trailer.brand || '',
        model: trailer.model || '',
        year: trailer.year || '',
        capacity: trailer.capacity || '',
        currentKm: trailer.currentKm || 0,
      });
    } else {
      setFormData(initialState);
    }
  }, [trailer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {trailer ? 'Edit Trailer' : 'Add New Trailer'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange} placeholder="Plate Number" required className="p-2 border rounded" />
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="p-2 border rounded" />
            <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model" required className="p-2 border rounded" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="p-2 border rounded" />
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Capacity (kg)" required className="p-2 border rounded" />
            </div>
            <input type="number" name="currentKm" value={formData.currentKm} onChange={handleChange} placeholder="Current Kilometers" className="p-2 border rounded" />
            <select name="type" value={formData.type} onChange={handleChange} required className="p-2 border rounded bg-white">
              <option value="Frigorifique">Frigorifique</option>
              <option value="Bâchée">Bâchée</option>
              <option value="Plateau">Plateau</option>
              <option value="Citerne">Citerne</option>
              <option value="Porte-conteneur">Porte-conteneur</option>
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrailerForm;