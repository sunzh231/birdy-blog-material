Install PHP The Yii2.0 require the verison of PHP must be >= 5.4.0, so before install PHP and its extensions, you must do like below first
    sudo add-apt-repository ppa:ondrej/php5
    sudo apt-get update
Then install PHP and its extensions
    sudo apt-get install php5-cgi php5-fpm php5-curl php5-mcrypt php5-gd php5-dev
PHP-FPM Status Management
    sudo service php5-fpm {start|stop|quit|restart|reload|logrotate}

Install Redis
    sudo apt-get install redis-server
Install PHP Redis extension
    sudo apt-get install php5-redis

Install nginx
    sudo apt-get install nginx
Config nginx
    vi /etc/nginx/conf.d/wm.conf

server {
    listen       80;
    server_name wm.com *.wm.com;
    root  /usr/share/nginx/www/aug-marketing/src/backend/web;
    index index.html index.htm index.php;

    access_log /var/log/nginx/wm.com-access.log;
    error_log  /var/log/nginx/wm.com-error.log;

    location / {
        proxy_pass http://wm.com:81;
    }

    location /api {
        try_files $uri $uri/ /index.php?$args;
    }

    location /webapp/build/ {
        alias /usr/share/nginx/www/aug-marketing/src/webapp/web/build/;
    }

    location /webapp {
        proxy_pass http://wm.com:82;
    }

    location ~ .*\.(php|php5)?$ {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        # or fastcgi_pass   127.0.0.1:9000;
        include        fastcgi_params;
    }

    location ~ /\.(ht|svn|git) {
            deny all;
    }
}

server {
    listen       81;
    server_name wm.com *.wm.com;
    root  /usr/share/nginx/www/aug-marketing/src/frontend/web;
    index index.html index.htm index.php;

    access_log /var/log/nginx/wm.com-access.log;
    error_log  /var/log/nginx/wm.com-error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location /vendor/ {
        alias /usr/share/nginx/www/aug-marketing/src/vendor/;
    }

    location /dist/ {
        alias /usr/share/nginx/www/aug-marketing/src/web/dist/;
    }

    location ~ .*\.(php|php5)?$ {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        # or fastcgi_pass   127.0.0.1:9000;
        include        fastcgi_params;
    }

    location ~ /\.(ht|svn|git) {
            deny all;
    }
}

server {
    listen       82;
    server_name wm.com *.wm.com;
    root /usr/share/nginx/html/aug-marketing/src/webapp/web;
    index index.php;

    access_log /var/log/nginx/wm-webapp-access.log;
    error_log  /var/log/nginx/wm-webapp-error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
        #try_files $uri$args $uri$args/ index.php;
    }

    location /vendor/ {
        alias /usr/share/nginx/html/aug-marketing/src/vendor/;
    }

    location /dist/ {
        alias /usr/share/nginx/html/aug-marketing/src/web/dist/;
    }

    location ~ .*\.(php|php5)?$ {
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        # or fastcgi_pass   127.0.0.1:9000;
        include        fastcgi_params;
    }

    location ~ /\.(ht|svn|git) {
            deny all;
    }

    location ~ /.+\.(coffee|scss) {
           deny all;
    }
}


Install Mongo Follow the setup guide, and select the 2.6 version to install.
Install PHP Mongo Extension
    sudo pecl install mongo
After install successfully, create 'mongo.ini' file in /etc/php5/mods-available, write 'extension=mongo.so' to it. Then create symbol link like below
    sudo ln -s /etc/php5/mods-available/mongo.ini /etc/php5/fpm/conf.d/30-mongo.ini
    sudo ln -s /etc/php5/mods-available/mongo.ini /etc/php5/cgi/conf.d/30-mongo.ini
    sudo ln -s /etc/php5/mods-available/mongo.ini /etc/php5/cli/conf.d/30-mongo.ini
Restart PHP-fpm
    sudo service php5-fpm restart

Install Mongo Follow the setup guide, and select the 2.6 version to install.
Install PHP Mongo Extension Download souce code from github mongo php driver
    $ tar zxvf mongodb-mongodb-php-driver-<commit_id>.tar.gz
    $ cd mongodb-mongodb-php-driver-<commit_id>
    $ phpize
    $ ./configure
    $ sudo make install
After install successfully, create 'mongo.ini' file in /etc/php5/mods-available, write 'extension=mongo.so' to it.
Restart PHP-fpm
    sudo service php5-fpm restart

    vi /etc/hosts
Add below line to your host file
    127.0.0.1 wm.com

Install ruby (version > 1.9.1)
    sudo apt-get install ruby
Use mirror for ruby
    gem sources --remove http://rubygems.org/
    gem sources -a https://ruby.taobao.org/
    gem sources -l
    *** CURRENT SOURCES ***
    https://ruby.taobao.org
Ensure only ruby.taobao.org exists
Install SASS
    gem install sass

Install nodejs
    curl https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash
    . ~/.profile
    nvm install v0.10.24
Install grunt
    npm install -g grunt-cli
Setup bower
    npm install -g bower

nstall supervisor
    sudo apt-get install supervisor
Config supervisor
    sudo vi /etc/supervisor/conf.d/supervisor.conf

[program:scheduler]
process_name=%(program_name)s_%(process_num)02d
directory=/home/user/aug-marketing
command=php /home/user/aug-marketing/src/backend/modules/resque/components/bin/resque-scheduler
numprocs=1
redirect_stderr=True
autostart=True
autorestart= True
environment=QUEUE='global',LOGGING='1',APP_INCLUDE='/home/user/aug-marketing/src/backend/modules/resque/components/lib/Resque/RequireFile.php'
stdout_logfile=/var/log/supervisor/%(program_name)s-stdout.log
stderr_logfile=/var/log/supervisor/%(program_name)s-stderr.log

[program:global]
process_name=%(program_name)s_%(process_num)02d
directory=/home/user/aug-marketing
command=php /home/user/aug-marketing/src/backend/modules/resque/components/bin/resque
numprocs=5
redirect_stderr=True
autostart=True
autorestart= True
environment=QUEUE='global',LOGGING='1',APP_INCLUDE='/home/user/aug-marketing/src/backend/modules/resque/components/lib/Resque/RequireFile.php'
stdout_logfile=/var/log/supervisor/%(program_name)s-stdout.log
stderr_logfile=/var/log/supervisor/%(program_name)s-stderr.log