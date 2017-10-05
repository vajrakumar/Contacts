# ContactsAppExt6

This folder is primarily a container for backend code which is written using Express and Node.js code. 
While you can remove some files and folders that this application does not use, be sure to read below before deciding what can be deleted and what needs to be kept in source control.

The following files are all needed to build and load the application.

* For backend we have used NodeJS with Express framework.
* DataBase used is **PostgreSQL**.    
* In `"package.json"` file contains details like name, version etc. about this projet, 'dependencies' block contains all the packages used in server side for this project.
* `"views"` folder contains view specific files. As we have used ejs to display view here it holds all ejs files (Templates to display the server side messages).
* `"routes"` folder contains different routes we created so tht to structure our code neately.
  * File `"avatarUploader.js"` handles all the code related to uploading avatar
  * File `"contacttype.js"` handles all the requests with respect to different types of contacting user like phonenumber, emails, dates and urls.
  * File `"contactuser.js"` handles all the requsts about details of contact like Name, Organization etc.
* `"ContactApp"` is the folder which holds client side code which is writen in ExtJS.


## Install

### 1. PostgreSQL

On Mac:
Download the PostgresSQL.app from http://postgresapp.com/

### 2. Setting up local development environment

Open PostgreSQL console:

   a. Create Data Base Role
   
      CREATE ROLE "<<ROLE NAME>>" LOGIN PASSWORD "<<PASSWORD>>" NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
      
      <<ROLE NAME>>: Replace with Role Name for which database access is given admin rights
      <<PASSWORD>>: Replace with Password for the role created
 
   b. Create Table Space
   
     CREATE TABLESPACE "<<TABLE SPACE>>" OWNER "<<ROLE NAME>>" LOCATION "<<TABLE SPACE SAVE PATH>>";
 
     <<TABLE SPACE>>: Tabel Space for Contact applicaiton 
     <<ROLE NAME>>: Role Name created in the "setp:a"
     <<TABLE SPACE SAVE PATH>>: Path of the table space to be created. Make sure the folder is created before running this command.
 
   c. Create Databse
   
     CREATE DATABASE contacts_app_development WITH OWNER "<<ROLE NAME>>" ENCODING = "UTF8" TABLESPACE="<<TABLE SPACE>>" LC_COLLATE = "C"
     LC_CTYPE = "UTF-8" CONNECTION LIMIT="-1";
     
     <<TABLE SPACE>>: Tabel Space created in "step:b"
     <<ROLE NAME>>: Role Name created in the "setp:a"
  
   d. Grant Access
   
     GRANT CONNECT, TEMPORARY ON DATABASE contacts_app_development TO public;
     GRANT ALL ON DATABASE contacts_app_development TO "<<ROLE NAME>>";
     
     <<ROLE NAME>>: Role Name created in the "setp:a"
   
Quit PostgreSQL console by pressing  ``\q`` + ``ENTER``

Import schema:

    psql contacts_app_development < DataBaseQueries/Postgres/CreateTableScript.sql

### 3. Setup config.json

    For running node applicaiton in development mode 
    cp config.development.sample.json config.development.json
    
    For running node applicaiton in testing mode
    cp config.testing.sample.json config.testing.json
    
    For running node applicaiton in production mode
    cp config.production.sample.json config.production.json

Edit config.json to adjust your database connection settings 

### 4. Run server:
    For running node applicaiton in development mode 
    $ NODE_ENV=development node server.js 
    
    For running node applicaiton in testing mode
    $ NODE_ENV=testing node server.js
    
    For running node applicaiton in production mode
    $ NODE_ENV=production node server.js
    

## Setting up local testing environment

Basically the same steps as for setting up local development environment where `development` is replaced with `testing`.

 Note: In Mac While running application you may get error because of permission issue for Node not having permission to execute. In that case run the below command

 $ sudo chown -R $USER /usr/local

## Documentation

http://vajrakumar.github.io/
