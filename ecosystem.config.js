module.exports = {
  apps: [
    {
      name: 'subrinaclub-app', // Name of your application
      script: 'npm', // The script to run
      args: 'start', // Arguments to pass to the script
      instances: 1, // Number of instances to run
      autorestart: true, // Automatically restart if the app crashes
      watch: false, // Watch for file changes and restart
      max_memory_restart: '1G', // Restart if memory usage exceeds 1GB
      env: {
        NODE_ENV: 'development',
        // Add other environment variables here
      },
      env_production: {
        NODE_ENV: 'production',
        // Add production-specific environment variables here
      }
    }
  ]
}; 