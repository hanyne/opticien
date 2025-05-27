import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';

const CreateUser = () => {
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'client' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      if (!token) {
        setError('Veuillez vous connecter en tant qu\'admin');
        navigate('/signin');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/admin/register', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data);
      setMessage(response.data.msg);
      setNewUser({ email: '', password: '', role: 'client' });
    } catch (err) {
      console.error('API Error:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || 'Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <style>{`
        .main-content {
          margin-left: 250px;
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
        }
        .section-title {
          font-size: 2.8rem;
          margin-bottom: 2rem;
          text-align: center;
          color: #1e3a8a;
          font-weight: 700;
        }
        .form-container {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          margin: 0 auto;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          font-size: 1rem;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 5px;
          font-size: 1rem;
        }
        .form-group button {
          background: #1e3a8a;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
        }
        .form-group button:hover {
          background: #172554;
        }
        .message {
          text-align: center;
          margin-top: 1rem;
          color: #10b981;
        }
        .error-text {
          text-align: center;
          margin-top: 1rem;
          color: #f43f5e;
        }
      `}</style>

      <div style={styles.mainContent} className="main-content">
        <h2 style={styles.sectionTitle}>Créer un nouvel utilisateur</h2>

        {error && <p className="error-text">{error}</p>}
        {message && <p className="message">{message}</p>}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Mot de passe:</label>
              <input type="password" name="password" value={newUser.password} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Rôle:</label>
              <select name="role" value={newUser.role} onChange={handleInputChange} required>
                <option value="client">Client</option>
                <option value="opticien">Opticien</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit">Créer utilisateur</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { overflowX: 'hidden', background: '#fff' },
  mainContent: { marginLeft: '250px', padding: '2rem', background: '#f5f5f5', minHeight: '100vh' },
  sectionTitle: { fontSize: '2.8rem', marginBottom: '2rem', textAlign: 'center', color: '#1e3a8a', fontWeight: 700 },
};

export default CreateUser;