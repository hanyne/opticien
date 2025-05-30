import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './AdminSidebar';
import { motion } from 'framer-motion';

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
      if (!token) {
        setError('Veuillez vous connecter en tant qu\'admin');
        navigate('/signin');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/admin/register', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(response.data.msg);
      setNewUser({ email: '', password: '', role: 'client' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-indigo-900 mb-8"
        >
          Créer un Nouvel Utilisateur
        </motion.h2>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-green-500 mb-4"
          >
            {message}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Mot de Passe
              </label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="role">
                Rôle
              </label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="client">Client</option>
                <option value="opticien">Opticien</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition"
            >
              Créer Utilisateur
            </button>
          </form>
        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default CreateUser;