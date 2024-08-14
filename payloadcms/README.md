## Make sure you have Node > 18.13.0 installed

## Then install the project dependencies:

```bash
npm install
```

## Use the **.env.example** file to setup an **.env** file to run the app, or just use the already existing **.env** file

## To run the dev app:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result (the port depends on the .env file).

# In case you use the .env file, that is part of this project, you can use this account to log into the admin panel:

email: testaccount@test.cz
password: password

# Disclaimer: Using the frontend app (while logged into the frontend app) while using the admin central won't work (same domain cookies)

# So either run each app in a separate browser or use one app at a time - sign out

# Worst case scenario - delete payload-token cookie in the browser console (Application -> cookies -> delete payload-token cookie)

# If using your own custom db etc. - you will most likely need to create an admin account, after creating one, you will be able to access the admin panel
