import { useEffect, useState } from "react";
import axios from "axios";
import { useQueryClient} from '@tanstack/react-query'
import { User } from '../types'

interface ChangeLog {
  _id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function ChangeLogView() {
  const [logs, setLogs] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient()
  const data : User = queryClient.getQueryData(['user'])!

useEffect(() => {
  const userId = data.handle;

  axios.get(import.meta.env.VITE_API_URL + "/api/changelog", {
    params: { userId }
  })
  .then(res => {
    setLogs(res.data);
    setLoading(false);
  })
  .catch(() => {
    setLoading(false);
  });
}, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Historial de Cambios</h2>

      {loading ? (
        <p className="text-center text-gray-500">Cargando historial...</p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500">No hay cambios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Usuario</th>
                <th className="py-3 px-6 text-left">Acción</th>
                <th className="py-3 px-6 text-left">Detalles</th>
                <th className="py-3 px-6 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{log.userId}</td>
                  <td className="py-3 px-6">{log.action}</td>
                  <td className="py-3 px-6">{log.details}</td>
                  <td className="py-3 px-6">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

