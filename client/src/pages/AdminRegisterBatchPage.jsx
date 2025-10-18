import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { createBatch, getAllDepartments, getAllBatches } from '../services/batchService';
import '../styles/department.css';

const AdminRegisterBatchPage = () => {
  const [batchFormData, setBatchFormData] = useState({
    startYear: new Date().getFullYear()
  });
  const [batchMessage, setBatchMessage] = useState({ type: '', text: '' });

  const [allDepartments, setAllDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [batches, setBatches] = useState([]);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await getAllDepartments(); 
        if(departments.success){
          setAllDepartments(departments.data);
        }
      } catch (err) {
        console.log('Failed to fetch departments', err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch existing batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getAllBatches();
        if(response.success){
          setBatches(response.data);
        }
      } catch (err) {
        console.log('Failed to fetch batches', err);
      }
    };
    fetchBatches();
  }, []);

  const handleDepartmentCheckbox = (deptId) => {
    if(selectedDepartments.find(d => d.departmentId === deptId)){
      setSelectedDepartments(selectedDepartments.filter(d => d.departmentId !== deptId));
    } else {
      setSelectedDepartments([...selectedDepartments, { departmentId: deptId, numberOfSections: 1 }]);
    }
  };

  const handleSectionChange = (deptId, value) => {
    setSelectedDepartments(selectedDepartments.map(d => 
      d.departmentId === deptId ? { ...d, numberOfSections: value } : d
    ));
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setBatchMessage({ type: '', text: '' });

    if(selectedDepartments.length === 0){
      setBatchMessage({ type: 'error', text: 'Select at least one department' });
      return;
    }

    const startYear = parseInt(batchFormData.startYear);
    const endYear = startYear + 3;
    const batchName = `${startYear}-${endYear}`;

    try {
      const response = await createBatch({ batchName, departments: selectedDepartments });

      if(response.success){
        setBatchMessage({ type: 'success', text: 'Batch created successfully!' });
        setBatchFormData({ startYear: new Date().getFullYear() });
        setSelectedDepartments([]);
        setBatches(prev => [...prev, response.data]);
      } else {
        setBatchMessage({ type: 'error', text: response.message || 'Failed to create batch' });
      }
    } catch (err) {
      setBatchMessage({ type: 'error', text: 'Failed to create batch. Try again.' });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="department-page">
      <div className="department-content">
        <h2 className="section-title">Create New Batch</h2>
        <form className="batch-form" onSubmit={handleBatchSubmit}>
          <div className="form-group">
            <label>Start Year:</label>
            <select value={batchFormData.startYear} onChange={e => setBatchFormData({...batchFormData, startYear: e.target.value})}>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Departments:</label>
            {allDepartments.map(dept => {
              const isSelected = selectedDepartments.find(d => d.departmentId === dept._id);
              return (
                <div key={dept._id} style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #ddd' }}>
                  <input 
                    type="checkbox" 
                    checked={!!isSelected} 
                    onChange={() => handleDepartmentCheckbox(dept._id)} 
                  />
                  <span style={{ marginLeft: '10px' }}>{dept.departmentName}</span>

                  {isSelected && (
                    <input 
                      type="number" 
                      min="1"
                      value={isSelected.numberOfSections} 
                      onChange={e => handleSectionChange(dept._id, parseInt(e.target.value))}
                      style={{ marginLeft: '20px', width: '50px' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {batchMessage.text && (
            <div className={`message ${batchMessage.type}`}>
              {batchMessage.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
              <span>{batchMessage.text}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary">Create Batch</button>
        </form>

        <h2 className="section-title" style={{marginTop:'40px'}}>Existing Batches</h2>
        {batches.length === 0 && <p>No batches yet.</p>}
        {batches.map(batch => (
          <div key={batch._id} style={{marginBottom:'20px', padding:'10px', border:'1px solid #ccc', borderRadius:'5px'}}>
            <h4>{batch.batchName}</h4>
            {batch.departments.map(d => (
              <p key={d.departmentId} style={{margin:'5px 0'}}>
                <strong>{d.departmentName}</strong> - {d.numberOfSections} Sections
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRegisterBatchPage;
