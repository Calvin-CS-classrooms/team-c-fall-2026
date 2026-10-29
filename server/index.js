// Starts the Express server on port 3000, allowing the React Native app to request data from our RESTful API
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});