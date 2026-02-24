import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDraft, setErrors, registerUser, deleteSelected } from './formSlice';
import './FormStyles.css';

const RegistrationForm = () => {
  const { draft, errors, users } = useSelector((state) => state.registration);
  const dispatch = useDispatch();

  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName} ${u.lastName}`;
    const cleanSearch = searchTerm.replace(/\s+/g, '').toLowerCase().trim();
    return (
      fullName.replace(/\s+/g, '').toLowerCase().includes(cleanSearch) || u.lastName.toLowerCase().includes(cleanSearch) || u.email.toLowerCase().includes(cleanSearch) || u.mobileNo.includes(cleanSearch))
  })
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = filteredUsers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  }

  const handleSelectAll = (e) => {
    const currentPageIds = currentRecords.map(u => u.id);
    if (e.target.checked) {
      setSelectedIds(prev => [...new Set([...prev, ...currentPageIds])]);
    }
    else {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };
  const isAllSelected = currentRecords.every(u => selectedIds.includes(u.id));
  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} record(s)?`)) {
      dispatch(deleteSelected(selectedIds));
      setSelectedIds([]);
      if (currentRecords.length === selectedIds.length && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const fillMockData = () => {
    const mockUsers = Array.from({ length: 100 }, (_, i) => ({
      id: Date.now() + i,
      firstName: `User${i + 1}`,
      lastName: `Test`,
      email: `user${i + 1}@example.com`,
      mobileNo: `98765432${i.toString().padStart(2, '0')}`,
      password: "Password123!",
      role: 'user',
      details: "Automated mock data for testing."
    }));
    localStorage.setItem('registeredUsers', JSON.stringify(mockUsers));
    window.location.reload(); // Reload to see changes
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'mobileNo', label: 'Mobile No', type: 'tel', placeholder: '10 digit number', size: '10' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  const validate = (currentDraft, userList = []) => {

    const rules = {
      firstName: v => /^[A-Za-z]+$/.test(v) || "Letters only, no spaces .",
      lastName: v => /^[A-Za-z]+$/.test(v) || "Letters only, no spaces.",
      email: v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || "Invalid email format (e.g. name@domain.com).",
      password: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(v) || "Password needs 8+ chars, uppercase, lowercase, number, and special char.",
      confirmPassword: v => v === currentDraft.password || "Passwords do not match.",
      mobileNo: v => /^\d{10}$/.test(v) || "Must be exactly 10 digits (0-9)."
    };

    const liveErrs = {};
    Object.keys(currentDraft).forEach(key => {
      const val = currentDraft[key]?.toString().trim();
      if (!val) {
        liveErrs[key] = `${key.replace(/([A-Z])/g, ' $1')} is required.`;
      }
      else if (key === 'email' && userList.some(u => u.email === val)) {
        liveErrs[key] = "Already registered with this email.";
      }
      else if (key === 'mobileNo' && userList.some(u => u.mobileNo === val)) {
        liveErrs[key] = "Already registered with this phone number.";
      }
      else if (rules[key]) {
        const result = rules[key](val);
        if (typeof result === 'string') liveErrs[key] = result;
      }
    });

    return liveErrs;
  };

  const handleInputtChange = (name, value) => {
    const updatedDraft = { ...draft, [name]: value };
    dispatch(updateDraft({ name, value }));
    const validationErrors = validate(updatedDraft, users);
    dispatch(setErrors(validationErrors));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(draft, users);
    if (Object.keys(validationErrors).length > 0) { dispatch(setErrors(validationErrors)); }
    else { dispatch(registerUser()); }
  };

  const renderInput = ({ name, label, type, placeholder, size }) => {
    const isRequiredError = errors[name] && errors[name].toLowerCase().includes('required');
    return (
      <div className="input-box" key={name}>
        <label>{label}:{isRequiredError && <span className="required-star"> *</span>}</label>
        <input
          name={name} type={type} placeholder={placeholder}
          value={draft[name]} size={size} onChange={(e) => handleInputtChange(name, e.target.value)}
          className={errors[name] ? 'input-err' : ''}
        />
        {errors[name] && <span className="err-txt">{errors[name]}</span>}
      </div>
    );
  }

  const CustomDropDown = ({ label, options, value, onChange, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
      <div className="input-box" style={{ maxWidth: '425px' }} ref={dropDownRef}>
        <label>{label}:{error && <span className="required-star"> *</span>}</label>
        <div className={` ${error ? 'input-err' : 'custom-dropdown'}`}>
          <div className='dropdown-header' onClick={() => setIsOpen(!isOpen)}>
            {value || "Select Option"}</div>
        </div>
        {isOpen && (
          <ul className='dropdown-options'>{
            options.map((opt) => (<li key={opt} onClick={() => { onChange(opt); setIsOpen(false) }} >{opt}</li>))
          }</ul>
        )}
        {error && <span className="err-txt">{error}</span>}
      </div>
    )
  }

  return (
    <div className="container">
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div className="row">{fields.slice(0, 2).map(renderInput)}</div>
        <div className="row">{fields.slice(2, 4).map(renderInput)}</div>
        <div className="row">{fields.slice(4, 
          
          6).map(renderInput)}</div>

        <CustomDropDown
          label="Role"
          options={["Admin", "User", "Guest"]}
          value={draft.role}
          onChange={(val) => handleInputtChange('role', val)}
          error={errors.role}
        />

        <div className="full-width">
          <label ><b>Details:</b>{errors.details?.toLowerCase().includes('required') && <span className="required-star"> *</span>}</label>
          <textarea name="details"
            value={draft.details}
            onChange={(e) => handleInputtChange('details', e.target.value)}
            className={errors.details ? 'input-err' : ''}
          />
          {errors.details && <span className="err-txt">{errors.details}</span>}
        </div>

        <button type="submit" className="submit-btn" >Register</button>
      </form>

      <div className="user-list">
        <p> <b>To Delete:</b> Use the checkboxes to select records. You can delete multiple records at once using the button that appears.</p>
        <div style={{ display: 'flex' }}>
          <h3>Registered Records ({users.length})</h3> {selectedIds.length > 0 && (<div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <button onClick={() => { setSelectedIds([]); }} className="clear-btn">
              Clear Selection
            </button>
            <button onClick={handleBulkDelete} className="bulk-delete-btn">
              Delete Selected ({selectedIds.length})
            </button>
          </div>)}</div>

        <input type="text" placeholder='Search by Name,email,or,phone...' value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }} style={{ margin: '20px  0px' }} />
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} /></th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map(u => (
                <tr key={u.id} className={selectedIds.includes(u.id) ? 'selected-row' : ''}>
                  <td><input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                  <td>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.mobileNo}</td>
                </tr>
              ))) : (<tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No records found matching "{searchTerm}"</td>
              </tr>)}
          </tbody>
        </table>
        {
          totalPages > 1 && (
            <div className='pagination' >
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (<button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'active-page' : ''}
                >{pageNum}</button>)
              })}
            </div>
          )
        }

        <button onClick={fillMockData}>
          FillMockData
        </button>

      </div >
    </div >
  );
};

export default RegistrationForm;


