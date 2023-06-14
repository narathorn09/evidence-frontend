// const fs = require("fs");
// const os = require("os");
// const dotenv = require("dotenv");

// // Function to get the IPv4 address
// function getIPv4Address() {
//   const networkInterfaces = os.networkInterfaces();

//   for (const interfaceName in networkInterfaces) {
//     const interfaces = networkInterfaces[interfaceName];

//     for (const iface of interfaces) {
//       if (iface.family === "IPv4" && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }

//   return "IPv4 address not found";
// }

// // Call the function to get the IPv4 address
// const ipAddress = getIPv4Address();
// const url = `http://${ipAddress}:8000`;
// // Load the existing .env file
// const existingEnv = dotenv.parse(fs.readFileSync(".env"));

// // Merge existing .env data with the new IP address
// const updatedEnv = { ...existingEnv, REACT_APP_API_SERVER: url };

// // Convert the merged data into a string
// const updatedEnvString = Object.keys(updatedEnv)
//   .map((key) => `${key}=${updatedEnv[key]}`)
//   .join("\n");

// // Save the updated .env file
// fs.writeFileSync(".env", updatedEnvString);

// // Load the .env file
// dotenv.config();

// // Access the REACT_APP_API_SERVER variable from .env
// // const envIpAddress = process.env.REACT_APP_API_SERVER;

// // Display the IP address
// console.log("IP Address:", ipAddress);
