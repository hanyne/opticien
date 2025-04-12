// client/src/pages/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/AdminSidebar';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Récupérer toutes les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
      } catch (err) {
        setError('Erreur lors de la récupération des catégories');
      }
    };
    fetchCategories();
  }, []);

  // Ajouter ou modifier une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/categories/${editId}`,
          { name, description },
          { headers: { 'x-auth-token': token } }
        );
        setCategories(
          categories.map((cat) =>
            cat._id === editId ? res.data.category : cat
          )
        );
        setSuccess('Catégorie mise à jour avec succès');
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/categories',
          { name, description },
          { headers: { 'x-auth-token': token } }
        );
        setCategories([...categories, res.data.category]);
        setSuccess('Catégorie ajoutée avec succès');
      }
      setName('');
      setDescription('');
      setEditId(null);
      setError('');
      // Rafraîchir la liste des catégories après ajout/modification
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err.response || err);
      setError(
        err.response?.data?.msg || err.message || 'Erreur lors de la soumission'
      );
      setSuccess('');
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      console.log(`Suppression de la catégorie avec ID: ${id}`);
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { 'x-auth-token': token },
      });
      setCategories(categories.filter((cat) => cat._id !== id));
      setSuccess('Catégorie supprimée avec succès');
      setError('');
      // Rafraîchir la liste des catégories après suppression
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err.response || err);
      setError(err.response?.data?.msg || 'Erreur lors de la suppression');
      setSuccess('');
    }
  };

  // Charger les données pour modification
  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
    setDescription(category.description);
  };

  return (
    <div style={styles.pageContainer}>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          color: #4b5563;
          line-height: 1.6;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .sidebar-link.active {
          background: rgba(255, 255, 255, 0.2);
        }

        .main-content {
          margin-left: 250px;
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
        }

        .form-card {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          margin: 0 auto 2rem;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.8rem;
          margin-bottom: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 5px;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #1e3a8a;
          box-shadow: 0 0 5px rgba(30, 58, 138, 0.3);
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-button {
          width: 100%;
          padding: 0.8rem;
          background: #1e3a8a;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .form-button:hover {
          background: #3b82f6;
        }

        .error-message {
          color: #ef4444;
          text-align: center;
          margin-bottom: 1rem;
        }

        .success-message {
          color: #10b981;
          text-align: center;
          margin-bottom: 1rem;
        }

        .table-container {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 100%;
          margin: 0 auto;
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .th,
        .td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .th {
          background: #1e3a8a;
          color: #fff;
          font-weight: 600;
        }

        .td {
          background: #fff;
        }

        .action-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-right: 0.5rem;
          transition: background 0.3s ease;
        }

        .edit-button {
          background: #3b82f6;
          color: #fff;
        }

        .edit-button:hover {
          background: #2563eb;
        }

        .delete-button {
          background: #ef4444;
          color: #fff;
        }

        .delete-button:hover {
          background: #dc2626;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 200px;
            padding: 1rem;
          }

          .form-card {
            padding: 1rem;
          }

          .table-container {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>

      <Sidebar />

      <div style={styles.mainContent} className="main-content">
        <h2 style={styles.sectionTitle}>Gestion des catégories</h2>

        {/* Formulaire d'ajout/modification */}
        <div style={styles.formCard} className="form-card">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
            <button type="submit" className="form-button">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Liste des catégories */}
        <h3 style={styles.subtitle}>Liste des catégories</h3>
        <div style={styles.tableContainer} className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Nom</th>
                <th className="th">Description</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="td">{category.name}</td>
                  <td className="td">{category.description}</td>
                  <td className="td">
                    <button
                      onClick={() => handleEdit(category)}
                      className="action-button edit-button"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="action-button delete-button"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    overflowX: 'hidden',
    background: '#fff',
  },
  mainContent: {
    marginLeft: '250px',
    padding: '2rem',
    background: '#f5f5f5',
    minHeight: '100vh',
  },
  sectionTitle: {
    fontSize: '2.8rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#1e3a8a',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#1e3a8a',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  formCard: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },
  tableContainer: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    maxWidth: '100%',
    margin: '0 auto',
  },
};

export default AdminCategories;