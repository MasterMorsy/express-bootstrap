const errorTemplate = function (error) {
  // Destructure values from fullErrorResponse
  const { message, status, stack, date, environment, request, os } = error;
  const { nodeVersion, env } = environment || {};

  // Build the HTML email template
  return {
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Error Notification</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #d9534f; }
          p { font-size: 16px; }
          pre { background-color: #f8f9fa; padding: 10px; border: 1px solid #ddd; }
          .error-info { margin-bottom: 20px; }
          .environment, .request { margin-top: 10px; }
          .environment table, .request table { border-collapse: collapse; width: 100%; }
          .environment table td, .request table td { padding: 5px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Application Error Notification</h1>
        <p>An error occurred in the application:</p>
        
        <div class="error-info">
          <p><b>Error Message:</b> ${message}</p>
          <p><b>Status:</b> ${status}</p>
          <p><b>Date:</b> ${date}</p>
          <pre><b>Error Stack Trace:</b><br>${stack}</pre>
        </div>
        
        <div class="environment">
          <h3>Environment Details:</h3>
          <table>
            <tr><td><b>Node Version:</b></td><td>${nodeVersion}</td></tr>
            <tr><td><b>OS Platform:</b></td><td>${os?.platform}</td></tr>
            <tr><td><b>OS Release:</b></td><td>${os?.release}</td></tr>
            <tr><td><b>OS Type:</b></td><td>${os?.type}</td></tr>
            <tr><td><b>Environment:</b></td><td>${env}</td></tr>
          </table>
        </div>
  
        ${
          request
            ? `<div class="request">
            <h3>Request Details:</h3>
            <table>
              <tr><td><b>URL:</b></td><td>${request.url}</td></tr>
              <tr><td><b>Method:</b></td><td>${request.method}</td></tr>
              <tr><td><b>Headers:</b></td><td><pre>${JSON.stringify(request.headers, null, 2)}</pre></td></tr>
              <tr><td><b>Body:</b></td><td><pre>${JSON.stringify(request.body, null, 2)}</pre></td></tr>
            </table>
          </div>`
            : ""
        }
      </body>
      </html>`,
  };
};

function bugTracker(errors) {
  mailer(["your_email"], `Error from application_name`, `Error from application_name`, errorTemplate(errors?.error).html);
}

module.exports = bugTracker;
