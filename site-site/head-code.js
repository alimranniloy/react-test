const fs = require("fs");

// Read the built HTML file
const htmlFilePath = "dist/index.html";
const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

// Define the replacement content
const head = `
  {% if site.head %}
    {{ site.head|safe }}
  {% endif %}
`;

// Perform the replacement
const headCode = htmlContent.replace("<!-- Your head code here -->", head);
// Write the modified content back to the HTML file
fs.writeFileSync(htmlFilePath, headCode, "utf8");

console.log("Custom code replacement completed.");
