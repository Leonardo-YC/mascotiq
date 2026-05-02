/**
 * PRUEBAS DE RENDIMIENTO, CARGA, ESTRÉS Y VOLUMEN
 * tests/load/performance.js
 * 
 * Requiere tener instalada la herramienta k6 (https://k6.io/docs/get-started/installation/)
 */

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // Simulamos diferentes escenarios de tráfico local
  stages: [
    { duration: '10s', target: 20 }, // 1. Carga normal: Sube a 20 usuarios simultáneos
    { duration: '20s', target: 20 }, // 2. Rendimiento: Mantiene la carga constante
    { duration: '10s', target: 50 }, // 3. Estrés/Volumen: Pico alto repentino de 50 usuarios
    { duration: '10s', target: 0 },  // 4. Recuperación: Baja a 0 usuarios
  ],
  thresholds: {
    // La prueba falla si el 95% de las peticiones tardan más de 500ms
    http_req_duration: ['p(95)<500'],
    // La prueba falla si hay más de 1% de errores HTTP
    http_req_failed: ['rate<0.01'], 
  },
};

export default function () {
  // Apuntamos a tu servidor local de Next.js
  const res = http.get('http://localhost:3000/');
  
  check(res, {
    'status es 200': (r) => r.status === 200,
  });
  
  // Cada "usuario" espera 1 segundo antes de volver a hacer click
  sleep(1);
}