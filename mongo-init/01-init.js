// Inicialización de MongoDB para el Worker
// Este script se ejecuta automáticamente cuando se crea el contenedor

// Cambiar a la base de datos worker_db
db = db.getSiblingDB('worker_db');

// Crear colección de configuración del worker
db.worker_config.insertOne({
  _id: "main_config",
  name: "Worker Configuration",
  version: "1.0.0",
  created_at: new Date(),
  settings: {
    max_concurrent_tasks: 10,
    retry_attempts: 3,
    timeout_seconds: 300
  }
});

// Crear colección para logs del worker
db.worker_logs.insertOne({
  _id: "init_log",
  level: "INFO",
  message: "Worker database initialized successfully",
  timestamp: new Date(),
  component: "initialization"
});

// Crear colección para tareas del worker
db.worker_tasks.insertOne({
  _id: "sample_task",
  task_type: "initialization",
  status: "completed",
  created_at: new Date(),
  completed_at: new Date(),
  data: {
    message: "Database initialization task"
  }
});

// Crear índices para optimizar consultas
db.worker_logs.createIndex({ "timestamp": -1 });
db.worker_logs.createIndex({ "level": 1 });
db.worker_tasks.createIndex({ "status": 1 });
db.worker_tasks.createIndex({ "created_at": -1 });

print("MongoDB worker_db initialized successfully with collections and sample data");