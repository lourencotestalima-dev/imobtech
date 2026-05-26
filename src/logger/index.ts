import { DateTime } from 'luxon';
import pino from 'pino';

export const createLogger = (destionation: string) => pino(
  {
    level: 'info',
    messageKey: 'message',
    formatters: {
      bindings: () => {
        return {}
      },
      level: (label) => {
        return { level: label.toUpperCase() }
      }
    },
    timestamp: () => `,"time":"${DateTime.now().setZone('America/Sao_Paulo').toISO()}"`
  },
  pino.destination({
    dest: destionation,
    sync: false
  })
);