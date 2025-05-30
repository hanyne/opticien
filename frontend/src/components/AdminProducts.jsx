import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './AdminSidebar';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState(''); // Added brand state
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [model3D, setModel3D] = useState(null);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté pour effectuer cette action');
          return;
        }

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/categories', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        if (categoriesRes.data.length > 0) {
          setCategory(categoriesRes.data[0]._id);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des données');
      }
    };
    fetchData();
  }, []);

  // Handle form submission for adding or updating a product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Vous devez être connecté pour effectuer cette action');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('brand', brand);
    if (image) {
      formData.append('image', image);
    }
    if (model3D) {
      formData.append('model3D', model3D);
    }

    try {
      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setProducts(
          products.map((prod) =>
            prod._id === editId ? res.data.product : prod
          )
        );
        setSuccess('Produit mis à jour avec succès');
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/products',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setProducts([...products, res.data.product]);
        setSuccess('Produit ajouté avec succès');
      }
      resetForm();
      // Refresh product list
      const productsRes = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err.response || err);
      setError(
        err.response?.data?.msg || err.message || 'Erreur lors de la soumission'
      );
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vous devez être connecté pour effectuer cette action');
      return;
    }

    try {
      console.log(`Suppression du produit avec ID: ${id}`);
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((prod) => prod._id !== id));
      setSuccess('Produit supprimé avec succès');
      // Refresh product list
      const productsRes = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Erreur lors de la suppression du produit:', err.response || err);
      setError(err.response?.data?.msg || 'Erreur lors de la suppression');
    }
  };

  // Load product data for editing
  const handleEdit = (product) => {
    setEditId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setBrand(product.brand || '');
    setCategory(product.category?._id || '');
    setImage(null);
    setModel3D(null);
    document.getElementById('image-input').value = '';
    document.getElementById('model3d-input').value = '';
  };

  // Reset form fields
  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setBrand('');
    setCategory(categories.length > 0 ? categories[0]._id : '');
    setImage(null);
    setModel3D(null);
    setEditId(null);
    document.getElementById('image-input').value = '';
    document.getElementById('model3d-input').value = '';
  };

  // Auto-dismiss toast logic
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000); // Auto-dismiss after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
        .form-textarea,
        .form-select {
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
        .form-textarea:focus,
        .form-select:focus {
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

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          animation: fadeIn 0.3s ease-in, fadeOut 0.3s ease-out 2.7s;
        }

        .toast.success {
          background: #10b981;
          color: #fff;
        }

        .toast.error {
          background: #ef4444;
          color: #fff;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
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

        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
        }
      `}</style>

      <Sidebar />

      <div style={styles.mainContent} className="main-content">
        <h2 style={styles.sectionTitle}>Gestion des produits</h2>

        {/* Form for adding/editing product */}
        <div style={styles.formCard} className="form-card">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom du produit"
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
            <input
              type="number"
              placeholder="Prix"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Marque"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="form-input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              required
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              id="image-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => setImage(e.target.files[0])}
              className="form-input"
            />
            <input
              id="model3d-input"
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => setModel3D(e.target.files[0])}
              className="form-input"
            />
            <button type="submit" className="form-button">
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
          </form>
        </div>

        {/* Product list */}
        <h3 style={styles.subtitle}>Liste des produits</h3>
        <div style={styles.tableContainer} className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Nom</th>
                <th className="th">Description</th>
                <th className="th">Prix</th>
                <th className="th">Stock</th>
                <th className="th">Marque</th>
                <th className="th">Catégorie</th>
                <th className="th">Image</th>
                <th className="th">Modèle 3D</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="td">{product.name}</td>
                  <td className="td">{product.description}</td>
                  <td className="td">{product.price} TND</td>
                  <td className="td">{product.stock}</td>
                  <td className="td">{product.brand || 'Non défini'}</td>
                  <td className="td">
                    {product.category ? product.category.name : 'Catégorie non définie'}
                  </td>
                  <td className="td">
                    {product.image ? (
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      'Aucune image'
                    )}
                  </td>
                  <td className="td">
                    {product.model3D ? (
                      <a
                        href={`http://localhost:5000${product.model3D}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Voir le modèle 3D
                      </a>
                    ) : (
                      'Aucun modèle 3D'
                    )}
                  </td>
                  <td className="td">
                    <button
                      onClick={() => handleEdit(product)}
                      className="action-button edit-button"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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

        {/* Toast for success/error messages */}
        {success && (
          <div className="toast success" role="alert">
            {success}
          </div>
        )}
        {error && (
          <div className="toast error" role="alert">
            {error}
          </div>
        )}
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

export default AdminProducts;