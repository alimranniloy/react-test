const fs = require("fs");

// Read the built HTML file
const htmlFilePath = "dist/index.html";
const htmlContent = fs.readFileSync(htmlFilePath, "utf8");

// Define the replacement content
const foot = `
  {% if site.foot %}
    {{ site.foot|safe }}
  {% endif %}
`;

// Perform the replacement
const footCode = htmlContent.replace("<!-- Your foot code here -->", foot);

// Write the modified content back to the HTML file
fs.writeFileSync(htmlFilePath, footCode, "utf8");

console.log("Custom code replacement completed.");
