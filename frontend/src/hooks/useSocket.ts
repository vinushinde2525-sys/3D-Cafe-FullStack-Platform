/**
 * useSocket — no-op in demo/offline mode.
 *
 * Socket.io connection is disabled because the backend is not running.
 * All returned functions are safe stubs. Zero network attempts made.
 *
 * To re-enable: set VITE_ENABLE_SOCKET=true in .env and uncomment connect().
 */
import { socketService } from '@/services/socket';

const SOCKET_ENABLED = import.meta.env.VITE_ENABLE_SOCKET === 'true';

type Unsub = () => void;

interface UseSocketReturn {
  socket: unknown;
  isConnected: boolean;
  trackOrder: (id: string) => void;
  untrackOrder: (id: string) => void;
  onOrderStatusUpdate: (cb: (d: { orderId: string; orderNumber: string; status: string; timestamp: string; note?: string }) => void) => Unsub;
  onEtaUpdate: (cb: (d: { orderId: string; estimatedMinutes: number; eta: string }) => void) => Unsub;
  joinKitchen: () => void;
  leaveKitchen: () => void;
  onNewOrder: (cb: (d: { orderId: string; orderNumber: string; total: number; itemCount: number }) => void) => Unsub;
  onOrderUpdated: (cb: (d: { orderId: string; status: string }) => void) => Unsub;
}

const noop = () => () => {};
const noopVoid = () => {};

// Demo/disabled branch: all stable, created once at module load.
const disabledImpl: UseSocketReturn = {
  socket:              null,
  isConnected:         false,
  trackOrder:          noopVoid,
  untrackOrder:        noopVoid,
  onOrderStatusUpdate: noop,
  onEtaUpdate:         noop,
  joinKitchen:         noopVoid,
  leaveKitchen:        noopVoid,
  onNewOrder:          noop,
  onOrderUpdated:      noop,
};

// Enabled branch: bind once against the singleton socketService, also stable.
const enabledImpl: UseSocketReturn = {
  socket:              null, // read live via getSocket() below where needed
  isConnected:         false,
  trackOrder:          (id: string) => socketService.trackOrder(id),
  untrackOrder:        (id: string) => socketService.untrackOrder(id),
  onOrderStatusUpdate: socketService.onOrderStatusUpdate.bind(socketService),
  onEtaUpdate:         socketService.onEtaUpdate.bind(socketService),
  joinKitchen:         () => socketService.joinKitchen(),
  leaveKitchen:        () => socketService.leaveKitchen(),
  onNewOrder:          socketService.onNewOrder.bind(socketService),
  onOrderUpdated:      socketService.onOrderUpdated.bind(socketService),
};

export const useSocket = (): UseSocketReturn => {
  if (!SOCKET_ENABLED) return disabledImpl;

  // socket/isConnected are live values that do change — read fresh each call,
  // but every function reference below is stable (module-level), so effects
  // that depend on them won't re-run spuriously.
  return {
    ...enabledImpl,
    socket:      socketService.getSocket(),
    isConnected: socketService.isConnected(),
  };
};
