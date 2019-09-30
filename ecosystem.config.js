module.exports = {
    apps: [{
        name: 'node-blog-server',
        script: './bin/www',

        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        args: 'one two',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }],

    deploy: {
        production: {
            user: 'root',
            host: '118.24.252.99',
            ref: 'origin/master',
            repo: 'git@github.com:chenggang321/node-blog-server.git',
            path: '/root/node-blog-server',
            ssh_options: "StrictHostKeyChecking=no",
            env: {
                "NODE_ENV": "production"
            },
            'post-deploy': 'npm install && npm start && pm2 reload ecosystem.config.js --env production'
        }
    }
};
