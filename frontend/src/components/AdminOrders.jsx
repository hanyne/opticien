import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './AdminSidebar';
import { EyeIcon, CheckCircleIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState('day'); // 'day' or 'month'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = {};
        if (selectedDate) {
          if (filterType === 'day') {
            params.date = selectedDate.toISOString().split('T')[0];
          } else {
            params.month = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1);
          }
        }
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          params,
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch orders error:', err.response?.data || err.message);
        setError('Erreur lors de la récupération des commandes');
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedDate, filterType]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setOrders(orders.map((order) => (order._id === orderId ? response.data.order : order)));
    } catch (err) {
      console.error('Status update error:', err.response?.data || err.message);
      setError(`Erreur lors de la mise à jour du statut: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
    } catch (err) {
      console.error('Delete order error:', err.response?.data || err.message);
      setError(`Erreur lors de la suppression de la commande: ${err.response?.data?.msg || err.message}`);
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const openOrderDetails = (order) => setSelectedOrder(order);
  const closeOrderDetails = () => setSelectedOrder(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600">
        <motion.div
          className="w-12 h-12 border-4 border-t-pink-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-xl font-semibold bg-white/90 p-6 rounded-lg shadow-lg"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen`}>
      <Sidebar />
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-3xl font-bold mb-6 ${darkMode ? 'text-pink-400' : 'text-blue-600'}`}
          >
            Gestion des Commandes
          </motion.h2>

          <div className="mb-6 flex items-center gap-4">
            <div>
              <label className="mr-2 text-gray-700 dark:text-gray-300">Filtrer par :</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
              >
                <option value="day">Jour</option>
                <option value="month">Mois</option>
              </select>
            </div>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat={filterType === 'day' ? 'yyyy-MM-dd' : 'yyyy-MM'}
                showMonthYearPicker={filterType === 'month'}
                placeholderText={filterType === 'day' ? 'Sélectionner un jour' : 'Sélectionner un mois'}
                className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-600 dark:bg-blue-800 text-white">
                    <th className="p-4 font-semibold">ID Commande</th>
                    <th className="p-4 font-semibold">Utilisateur</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold">Statut</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="p-4">{order._id.slice(-6)}</td>
                      <td className="p-4">{order.userId?.email || 'N/A'}</td>
                      <td className="p-4">{order.total.toFixed(2)} TND</td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              order._id,
                              order.status === 'en attente' ? 'validée' : 'en attente'
                            )
                          }
                          className={`p-2 rounded-full ${
                            order.status === 'validée'
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-red-500 hover:bg-red-600'
                          } transition-colors duration-200`}
                          title={order.status}
                        >
                          {order.status === 'validée' ? (
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          ) : (
                            <ExclamationCircleIcon className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Voir les détails"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer la commande"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={closeOrderDetails}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-pink-400">
                  Détails de la Commande #{selectedOrder._id.slice(-6)}
                </h3>
                <div className="space-y-4">
                  <p>
                    <strong>Utilisateur:</strong> {selectedOrder.userId?.email || 'N/A'}
                  </p>
                  <p>
                    <strong>Total:</strong> {selectedOrder.total.toFixed(2)} TND
                  </p>
                  <p>
                    <strong>Statut:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Adresse de livraison:</strong>{' '}
                    {`${selectedOrder.shipping.address}, ${selectedOrder.shipping.city}, ${selectedOrder.shipping.postalCode}`}
                  </p>
                  <p>
                    <strong>Méthode de paiement:</strong> {selectedOrder.paymentMethod}
                  </p>
                  <div>
                    <strong>Articles:</strong>
                    {selectedOrder.cartId?.items?.length > 0 ? (
                      <ul className="list-disc pl-5 mt-2">
                        {selectedOrder.cartId.items.map((item, index) => (
                          <li key={index}>
                            {item.product?.name || 'Produit inconnu'} - Quantité: {item.quantity} - Prix:{' '}
                            {item.product?.price
                              ? (item.product.price * item.quantity).toFixed(2)
                              : 'N/A'}{' '}
                            TND
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Aucun article trouvé dans cette commande.</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeOrderDetails}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        table {
          font-family: 'Inter', 'Poppins', sans-serif;
        }
        th, td {
          font-size: 0.95rem;
        }
        .dark table {
          color: #f1f5f9;
        }
        .react-datepicker-wrapper {
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;