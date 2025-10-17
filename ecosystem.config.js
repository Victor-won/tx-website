module.exports = {
  apps: [
    {
      name: 'tx-website',
      script: 'bash',
      args: ['-c', 'npm start'],
      cwd: '/Users/angck/tx-website',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'mysql://root:123123@localhost:3306/tx_website',
        NEXTAUTH_SECRET: 'TX_SECRET_KEY',
        NEXTAUTH_URL: 'http://localhost:3000',
      },
      error_file: '/Users/angck/.pm2/logs/tx-website-error.log',
      out_file: '/Users/angck/.pm2/logs/tx-website-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
