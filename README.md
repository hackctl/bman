<img width="1117" alt="Screenshot 2025-06-22 at 1 43 45 AM" src="https://github.com/user-attachments/assets/a696c456-fd0c-4430-95d9-3869c51427e8" />

### Blackbox exporter manager which helps to manage blackbox exporter modules , configuration with features such as config generation, configuration management. It is a goto final solution to setup blackbox exporter. 
<br>

# Key Features 
- supports module generation for http,tcp & ping
- Grenerate the preview and edit of the in-use configuration in realtime  
- supports config upload view update and the current configuration in use by blackbox. 
- Generate configuration with different types of module at once.
- Can update the in-use configuration in realtime, with hot reload.
- Supports tls verify file management with simple upload file option.
- Sync with running blackbox exporter
- An updated production grade manager version for bcongen
<br>

# Sample
<img width="1420" alt="Screenshot 2025-06-22 at 1 50 12 AM" src="https://github.com/user-attachments/assets/45de7645-2572-48a6-88e0-d3f62bf45110" />

<br> 
<br>

# Dependencies & Supported Platforms
- **Platforms:** @Docker
<br>

# Usage 

### Run the generator 
- `docker compose -f bman.yml up`

### Access 
- Access the ui with url after compose setup http://localhost:9116 (The port used by application is 3000 but is mapped to 9116 in compose setup) <br>
- Blackbox has been mapped on port 9115 accessible at http://localhost:9115

### Create Build (generate static files via webpack)
- To create the build, run command `npm run build` within the running container @ docker compose. The build files can be found at `/docs`

<hr>

![hackctl](https://github.com/user-attachments/assets/c7347fcf-6d29-4b99-a3c4-749841234ed1)
