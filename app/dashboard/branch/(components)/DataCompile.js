import { useState, useContext } from 'react';
import DataContext from '../../../context/DataContext';

const DataCompile = ({ data }) => {
  const [newColumn, setNewColumn] = useState('');
  const { setProcessedData } = useContext(DataContext);

  const handleAddColumn = () => {
    const updatedData = data.map(item => ({
      ...item,
      [newColumn]: '', // Initialize the new column with empty values
    }));
    setProcessedData(updatedData);
    setNewColumn('');
  };

  return (
    <div>
      <h2>Data Compile</h2>
      <input
        type="text"
        value={newColumn}
        onChange={(e) => setNewColumn(e.target.value)}
        placeholder="Enter new column name"
      />
      <button onClick={handleAddColumn}>Add Column</button>
    </div>
  );
};

export default DataCompile;
