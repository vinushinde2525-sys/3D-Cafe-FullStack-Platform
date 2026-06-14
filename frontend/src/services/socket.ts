import { io, Socket } from 'socket.io-client';
import { isBackendOnline, markBackendOffline } from '@/services/backendStatus';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Module-level: once disabled never re-enable this session
let _socket: Socket | null = null;
let _permanentlyDisabled = false;

class SocketService {
  connect(token?: string): Socket | null {
    // Never connect if backend already known offline
    if (_permanentlyDisabled || !isBackendOnline()) return null;
    if (_socket?.connected) return _socket;
    if (_socket) return null; // Already attempting

    _socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: token ? { token } : {},
      transports: ['websocket'],
      reconnection: false,  // We manage this — no internal reconnect loop
      timeout: 3000,
    });

    _socket.on('connect', () => {
      // Connected — backend is alive
    });

    _socket.on('connect_error', () => {
      // First failure → mark offline, destroy socket, never retry
      markBackendOffline();
      this._kill();
    });

    return _socket;
  }

  private _kill() {
    _permanentlyDisabled = true;
    if (_socket) {
      _socket.removeAllListeners();
      _socket.close();
      _socket = null;
    }
  }

  disconnect() { this._kill(); }
  getSocket(): Socket | null { return _socket; }
  isConnected(): boolean { return _socket?.connected ?? false; }

  // ── Event helpers — all safe when socket is null ──────────────────────────
  trackOrder(id: string)   { _socket?.emit('track_order', id); }
  untrackOrder(id: string) { _socket?.emit('untrack_order', id); }
  joinKitchen()            { _socket?.emit('join_kitchen'); }
  leaveKitchen()           { _socket?.emit('leave_kitchen'); }

  onOrderStatusUpdate(cb: (d: { orderId: string; orderNumber: string; status: string; timestamp: string; note?: string }) => void) {
    if (!_socket) return () => {};
    _socket.on('order_status_update', cb);
    return () => _socket?.off('order_status_update', cb);
  }
  onEtaUpdate(cb: (d: { orderId: string; estimatedMinutes: number; eta: string }) => void) {
    if (!_socket) return () => {};
    _socket.on('eta_updated', cb);
    return () => _socket?.off('eta_updated', cb);
  }
  onNewOrder(cb: (d: { orderId: string; orderNumber: string; total: number; itemCount: number }) => void) {
    if (!_socket) return () => {};
    _socket.on('new_order', cb);
    return () => _socket?.off('new_order', cb);
  }
  onOrderUpdated(cb: (d: { orderId: string; status: string }) => void) {
    if (!_socket) return () => {};
    _socket.on('order_updated', cb);
    return () => _socket?.off('order_updated', cb);
  }
  onDeliveryLocation(cb: (d: { orderId: string; lat: number; lng: number; timestamp: string }) => void) {
    if (!_socket) return () => {};
    _socket.on('delivery_location', cb);
    return () => _socket?.off('delivery_location', cb);
  }
  updateDeliveryLocation(orderId: string, lat: number, lng: number) {
    _socket?.emit('delivery_location_update', { orderId, lat, lng });
  }
}

export const socketService = new SocketService();
export default socketService;
