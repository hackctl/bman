const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const app = express();
const port = 3000;

// Load default configuration from blackbox_config.yml
let defaultConfig = {};
try {
    const configPath = "/blackbox/blackbox_config.yml";
    if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        defaultConfig = yaml.load(configContent);
        console.log('Default configuration loaded from ./blackbox/blackbox_config.yml');
    } else {
        console.warn(configPath + ' does not exist. Using empty default configuration.');
    }
} catch (error) {
    console.error('Error loading ./blackbox/blackbox_config.yml:', error);
}

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('docs'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint to get default configuration
app.get('/api/defaults', (req, res) => {
    res.json(defaultConfig);
});

// Endpoint to save configuration to blackbox_config.yml
app.post('/api/save', (req, res) => {
    try {
        const config = req.body;
        
        // Validate the configuration structure
        if (!config || !config.modules) {
            return res.status(400).json({ error: 'Invalid configuration structure' });
        }
        
        // Convert to YAML
        const yamlConfig = yaml.dump(config, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
        });
        
        // Save to blackbox_config.yml
        const configPath = path.join(__dirname, '..', 'blackbox', 'blackbox_config.yml');
        fs.writeFileSync(configPath, yamlConfig, 'utf8');
        
        // Reload the default config in memory
        defaultConfig = config;
        
        console.log('Configuration saved to ./blackbox/blackbox_config.yml');
        res.json({ success: true, message: 'Configuration saved successfully' });
    } catch (error) {
        console.error('Error saving configuration:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
});

app.post('/generate', (req, res) => {
    const config = generateConfig(req.body);
    res.json({ config });
});

app.post('/download', (req, res) => {
    try {
        const config = generateConfig(req.body);
        const filename = `${config.modules[0].name}.yml`;
        
        // Convert to YAML
        const yamlConfig = yaml.dump(config, {
            indent: 2,
            lineWidth: -1,
            noRefs: true
        });

        res.setHeader('Content-Type', 'text/yaml');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(yamlConfig);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error generating YAML');
    }
});

function generateConfig(formData) {
    // Create the base configuration structure
    const config = {
        modules: [{
            name: formData.moduleName || 'default_module',
            version: formData.version || '1.0.0',
            description: formData.description || '',
            type: formData.probeType,
            config: {}
        }]
    };

    // Add type-specific configuration
    switch (formData.probeType) {
        case 'http':
            config.modules[0].config = {
                endpoint: formData.httpEndpoint,
                method: formData.httpMethod,
                valid_status_codes: formData.validStatusCodes.split(',').map(code => parseInt(code.trim())),
                timeout: parseInt(formData.timeout) || 5
            };

            // Add headers if provided
            if (formData.headers) {
                const headers = {};
                formData.headers.split('\n').forEach(line => {
                    const [key, value] = line.split(':').map(item => item.trim());
                    if (key && value) {
                        headers[key] = value;
                    }
                });
                if (Object.keys(headers).length > 0) {
                    config.modules[0].config.headers = headers;
                }
            }

            // Add POST/PUT specific fields
            if (formData.httpMethod === 'POST' || formData.httpMethod === 'PUT') {
                if (formData.contentType) {
                    if (!config.modules[0].config.headers) {
                        config.modules[0].config.headers = {};
                    }
                    config.modules[0].config.headers['Content-Type'] = formData.contentType;
                }
                if (formData.requestBody) {
                    config.modules[0].config.body = formData.requestBody;
                }
            }

            // Add fail conditions
            if (formData.failIfBodyMatches) {
                config.modules[0].config.fail_if_body_matches_regexp = formData.failIfBodyMatches.split('\n').filter(line => line.trim());
            }
            if (formData.failIfBodyNotMatches) {
                config.modules[0].config.fail_if_body_not_matches_regexp = formData.failIfBodyNotMatches.split('\n').filter(line => line.trim());
            }
            if (formData.failIfSSL === 'on') {
                config.modules[0].config.fail_if_ssl = true;
            }
            if (formData.failIfNotSSL === 'on') {
                config.modules[0].config.fail_if_not_ssl = true;
            }

            // Add IP protocol settings
            if (formData.preferredIPProtocol) {
                config.modules[0].config.preferred_ip_protocol = formData.preferredIPProtocol;
            }
            if (formData.ipProtocolFallback === 'on') {
                config.modules[0].config.ip_protocol_fallback = true;
            }

            // Add valid HTTP versions if selected
            if (formData.validHttpVersions) {
                const versions = Array.isArray(formData.validHttpVersions) 
                    ? formData.validHttpVersions 
                    : [formData.validHttpVersions];
                if (versions.length > 0) {
                    config.modules[0].config.valid_http_versions = versions;
                }
            }

            // Add redirect settings
            if (formData.noFollowRedirects === 'on') {
                config.modules[0].config.no_follow_redirects = true;
            }
            break;

        case 'tcp':
            config.modules[0].config = {
                host: formData.tcpHost,
                port: parseInt(formData.tcpPort),
                timeout: parseInt(formData.timeout) || 5
            };
            break;

        case 'ping':
            config.modules[0].config = {
                host: formData.pingHost,
                packetCount: parseInt(formData.packetCount) || 4,
                timeout: parseInt(formData.timeout) || 5
            };
            break;
    }

    return config;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port} default port mappings 9116`);
}); 