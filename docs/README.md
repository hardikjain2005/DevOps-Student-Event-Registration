# GitHub Pages Deployment

This folder contains a single-file `index.html` optimized for GitHub Pages deployment.

## How to Enable GitHub Pages

1. Go to your GitHub repository settings
2. Navigate to **Pages** (under "Code and automation")
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select `main` and `/docs` folder
5. Click **Save**

Your site will be available at: `https://hardikjain2005.github.io/Student-Event-Registration-DEVOPS/`

## Important Note

The frontend currently connects to `http://localhost:3000/api` for the backend. To make the GitHub Pages site fully functional:

1. Deploy the backend to a cloud service (e.g., Render, Railway, Heroku)
2. Update the `API_URL` in `docs/index.html` (line 8 in the script section) to your deployed backend URL
3. Ensure your backend URL uses HTTPS (required for GitHub Pages)

## Testing Locally

Open `docs/index.html` in your browser with a local server running to test the functionality.
