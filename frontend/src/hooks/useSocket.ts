/**
 * useSocket — no-op in demo/offline mode.
 *
 * Socket.io connection is disabled because the backend is not running.
 * All returned functions are safe stubs. Zero network attempts made.
 *
 * To re-enable: set VITE_ENABLE_SOCKET=true in .env and uncomment connect().
 */

const SOCKET_ENABLED = import.meta.env.VITE_ENABLE_SOCKET === 'true';

const noop = () => () => {};

export const useSocket = () => {
  // When socket is explicitly enabled AND backend available, lazy-import real impl
  // For now: always return stubs — no WebSocket connections attempted
  if (!SOCKET_ENABLED) {
    return {
      socket:              null,
      isConnected:         false,
      trackOrder:          (_id: string) => {},
      untrackOrder:        (_id: string) => {},
      onOrderStatusUpdate: noop,
      onEtaUpdate:         noop,
      joinKitchen:         () => {},
      leaveKitchen:        () => {},
      onNewOrder:          noop,
      onOrderUpdated:      noop,
    };
  }

  // Only reaches here if VITE_ENABLE_SOCKET=true
  const { socketService } = require('@/services/socket');
  return {
    socket:              socketService.getSocket(),
    isConnected:         socketService.isConnected(),
    trackOrder:          (id: string) => socketService.trackOrder(id),
    untrackOrder:        (id: string) => socketService.untrackOrder(id),
    onOrderStatusUpdate: socketService.onOrderStatusUpdate.bind(socketService),
    onEtaUpdate:         socketService.onEtaUpdate.bind(socketService),
    joinKitchen:         () => socketService.joinKitchen(),
    leaveKitchen:        () => socketService.leaveKitchen(),
    onNewOrder:          socketService.onNewOrder.bind(socketService),
    onOrderUpdated:      socketService.onOrderUpdated.bind(socketService),
  };
};
