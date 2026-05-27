import { DateTime } from 'luxon';
import pino from 'pino';
import fs from 'fs';
import path from 'path';

export const createLogger = (destionation: string) => {
  fs.mkdirSync(path.dirname(destionation), { recursive: true });

  return pino(
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
};