import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = Number(localStorage.getItem('userId'));

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userId');
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: token,
        },
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserState = async (userId, currentState) => {
    if (userId === currentUserId) {
      return;
    }

    try {
      const token = localStorage.getItem('userId');
      await axios.put(
        `http://localhost:3000/users/state?id=${userId}&state=${!currentState}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo actualizar el usuario');
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <section className="admin-panel" onClick={(event) => event.stopPropagation()}>
        <div className="admin-panel-header">
          <h2>Panel de administración</h2>
          <button className="admin-close-btn" onClick={onClose} aria-label="Cerrar panel">×</button>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : error ? (
          <p className="admin-panel-error">{error}</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isCurrentUser = Number(user.id_usuario) === currentUserId;
                  const actionLabel = isCurrentUser
                    ? 'Tu'
                    : user.state
                      ? 'Desactivar'
                      : 'Activar';

                  return (
                    <tr key={user.id_usuario}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.role || (user.isAdmin ? 'admin' : 'user')}</td>
                      <td>{user.state ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button
                          className="admin-toggle-btn"
                          onClick={() => toggleUserState(user.id_usuario, user.state)}
                          disabled={isCurrentUser}
                          title={isCurrentUser ? 'No puedes desactivar tu propio usuario' : ''}
                        >
                          {actionLabel}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminPanel;
