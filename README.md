
<h1>BookLibraryApp  -  EBiblioteka</h1>
EBiblioteka is application I made for Internet Applications Programming school course as final project.

The application is made using MEAN Stack.

<b>What did I learn working on this project?</b>

<uo>
<li>MongoDB NoSql database</li>
<li>MongoDB Compass</li>
<li>Node.js and Express</li>
<li>Angular 12</li>
<li>JWT Authentication and Authorization using Angular interceptors to refresh tokens</li>
</uo>

</br>

<b>What are the application features?</b>
<uo>
<li>Functional registration and login system with JWT and change password functionality.</li>
<li>Role system (Administrator, Moderator, User, Guest) </li>
<li>CRUD Operations to manage books in library </li>
<li>Advanced book search </li>
<li>Editable user profile including user pictures </li>
<li>Book reservation system </li>
<li>CRUD Operations to manage users as administrator  </li>
<li>Book ratings and reviews  </li>
<li>Book of the day  </li>
<li>Notification system  </li>
</uo>


</br>
</br>
If You want to test application locally install following packages and run following commands:
</br>
</br>
First install and run MongoDB Community server

Seed database with following command (You will need mongodb tools):

````
mongorestore --uri="mongodb://localhost:27017" -d biblioteka -o <directory_backup>
````

Run following commands to start backend server:

````
cd Backend
npm install
npm run serve
````

Run following commands to start frontend dev:

````
cd Frontend
# Locally in your project.
npm install -D typescript
npm install -D ts-node

# Or globally with TypeScript.
npm install -g typescript
npm install -g ts-node


npm install
npm run start 
# Or ng serve

````

<img src="https://raw.githubusercontent.com/VukBakic/BookLibraryApp/main/Backend/public/images/readme.png">
<img src="https://raw.githubusercontent.com/VukBakic/BookLibraryApp/main/Backend/public/images/readme_1.png">
<img src="https://raw.githubusercontent.com/VukBakic/BookLibraryApp/main/Backend/public/images/readme_2.png">
<img src="https://raw.githubusercontent.com/VukBakic/BookLibraryApp/main/Backend/public/images/readme_3.png">
<img src="https://raw.githubusercontent.com/VukBakic/BookLibraryApp/main/Backend/public/images/readme_4.png">
