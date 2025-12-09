/**
 * Gathers and displays information accessible via client-side JavaScript,
 * including an external IP address lookup using a public API.
 */

// Gather browser information
async function gatherBrowserInfo() {
  var info = {
    "User-Agent (Browser Info)": navigator.userAgent,
    "Platform (OS)": navigator.platform,
    Language: navigator.language,
    "Cookies Enabled": navigator.cookieEnabled,
    "Screen Resolution": screen.width + " x " + screen.height,
    "Color Depth": screen.colorDepth + " bits",
    "Timezone Offset": new Date().getTimezoneOffset() / 60 + " hours",
    "Document URL": document.URL,
    Referrer: document.referrer || "None",
    "Max Touch Points": navigator.maxTouchPoints,
    // Placeholder for IP and Geo data
    "External IP Address": "Loading...",
    "Geolocation Status": "Checking...",
  };

  // Fetch IP Address using ipify API
  try {
    var ipResponse = await fetch("https://api.ipify.org?format=json");
    if (!ipResponse.ok) {
      throw new Error("HTTP error! status: " + ipResponse.status);
    }
    var ipData = await ipResponse.json();
    info["External IP Address"] = ipData.ip;
  } catch (error) {
    info["External IP Address"] = "Failed to retrieve IP";
    console.error("Error fetching IP:", error);
  }

  // Initial display before geo (in case geo takes time or fails)
  displayInfo(info);

  // Attempt to gather Geolocation (requires user permission)
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        info["Geolocation Status"] = "Permission Granted";
        info["Latitude"] = position.coords.latitude;
        info["Longitude"] = position.coords.longitude;
        // Re-display with updated geo data
        displayInfo(info);
      },
      (error) => {
        var errorMessage = "Permission denied or error";
        if (error && error.code) {
          errorMessage = "Permission denied or error (" + error.code + ")";
        }
        info["Geolocation Status"] = errorMessage;
        // Re-display with geo failure status
        displayInfo(info);
      }
    );
  } else {
    info["Geolocation Status"] = "Not Supported by browser";
    // Re-display with geo not supported status
    displayInfo(info);
  }
}

/**
 * Create an unordered list to display the gathered information on the page.
 */
function displayInfo(infoObject) {
  var outputElement = document.getElementById("output-info");
  if (!outputElement) {
    console.error("Output element not found");
    return;
  }

  outputElement.innerHTML = "<h2>Browser Fingerprint Information:</h2>";

  var ul = document.createElement("ul");
  ul.style.listStyleType = "none";

  for (var key in infoObject) {
    if (infoObject.hasOwnProperty(key)) {
      var value = infoObject[key];
      var li = document.createElement("li");
      // Highlight key findings
      if (key === "External IP Address" && value !== "Loading...") {
        li.innerHTML =
          "<strong>" +
          key +
          ':</strong> <span style="color: blue;">' +
          value +
          "</span>";
      } else if (key === "Geolocation Status" && value.includes("Granted")) {
        li.innerHTML =
          "<strong>" +
          key +
          ':</strong> <span style="color: green;">' +
          value +
          "</span>";
      } else {
        li.innerHTML = "<strong>" + key + ":</strong> " + value;
      }
      ul.appendChild(li);
    }
  }
  outputElement.appendChild(ul);
}

// Ensure the output container is created and the function runs on load
// Similar to body onload event (wait for the DOM to be loaded)
document.addEventListener("DOMContentLoaded", function () {
  // Basic setup for the output area in the HTML body
  var body = document.body;
  var outputDiv = document.createElement("div");
  outputDiv.id = "output-info";
  body.appendChild(outputDiv);

  // Run the data gathering function
  gatherBrowserInfo();
});
