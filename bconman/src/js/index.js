// Import styles
import '../css/style.css';

// Module counter for unique module names
let moduleCounter = 0;

// Probe field templates
const probeFields = {
    http: `
        <div class='mb-3'>
            <label class='form-label'>Timeout (seconds)</label>
            <input type='text' class='form-control timeout' value='5s' pattern='^[1-9][0-9]*s$' placeholder='5s'>
        </div>
        <div class='mb-3'>
            <label class='form-label'>HTTP Method</label>
            <select class='form-control http-method' required onchange="togglePostFields(this)">
                <option value='GET'>GET</option>
                <option value='POST'>POST</option>
                <option value='PUT'>PUT</option>
                <option value='DELETE'>DELETE</option>
            </select>
        </div>
        <div class='post-fields' style='display: none;'>
            <div class='mb-3'>
                <label class='form-label'>Content Type</label>
                <select class='form-control content-type'>
                    <option value='application/json'>application/json</option>
                    <option value='application/x-www-form-urlencoded'>application/x-www-form-urlencoded</option>
                    <option value='text/plain'>text/plain</option>
                </select>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Request Body</label>
                <textarea class='form-control request-body' rows='4' placeholder='{"key": "value"}'></textarea>
            </div>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Valid Status Codes (comma-separated)</label>
            <input type='text' class='form-control valid-status-codes' placeholder='200,201,204' required>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Valid HTTP Versions</label>
            <div class='form-check'>
                <input class='form-check-input http-version' type='checkbox' value='HTTP/1.0'>
                <label class='form-check-label'>HTTP/1.0</label>
            </div>
            <div class='form-check'>
                <input class='form-check-input http-version' type='checkbox' value='HTTP/1.1' checked>
                <label class='form-check-label'>HTTP/1.1</label>
            </div>
            <div class='form-check'>
                <input class='form-check-input http-version' type='checkbox' value='HTTP/2.0'>
                <label class='form-check-label'>HTTP/2.0</label>
            </div>
            <div class='form-check'>
                <input class='form-check-input http-version' type='checkbox' value='HTTP/3.0'>
                <label class='form-check-label'>HTTP/3.0</label>
            </div>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Headers (one per line, format: key: value)</label>
            <textarea class='form-control headers' rows='3' placeholder='User-Agent: Blackbox&#10;Accept: application/json'></textarea>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Fail if Body Matches (one per line)</label>
            <textarea class='form-control fail-if-body-matches' rows='2' placeholder='error&#10;503 Service Unavailable'></textarea>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Fail if Body Not Matches (one per line)</label>
            <textarea class='form-control fail-if-body-not-matches' rows='2'></textarea>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input fail-if-ssl' type='checkbox'>
                <label class='form-check-label'>Fail if SSL/TLS is used</label>
            </div>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input fail-if-not-ssl' type='checkbox'>
                <label class='form-check-label'>Fail if SSL/TLS is not used</label>
            </div>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Preferred IP Protocol</label>
            <select class='form-control preferred-ip-protocol'>
                <option value='ip4'>IPv4</option>
                <option value='ip6'>IPv6</option>
            </select>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input ip-protocol-fallback' type='checkbox' checked>
                <label class='form-check-label'>Try fallback IP protocol if preferred fails</label>
            </div>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input no-follow-redirects' type='checkbox'>
                <label class='form-check-label'>Don't follow HTTP redirects</label>
            </div>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input enable-tls' type='checkbox' onchange="toggleTlsConfig(this)">
                <label class='form-check-label'>Enable TLS Configuration</label>
            </div>
        </div>
        <div class='tls-config' style='display: none;'>
            <div class='mb-3'>
                <label class='form-label'>CA File</label>
                <input type='text' class='form-control tls-ca-file' placeholder='/etc/blackbox/certs/ca.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Certificate File</label>
                <input type='text' class='form-control tls-cert-file' placeholder='/etc/blackbox/certs/client.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Key File</label>
                <input type='text' class='form-control tls-key-file' placeholder='/etc/blackbox/certs/client.key'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Server Name</label>
                <input type='text' class='form-control tls-server-name' placeholder='my.api.server.com'>
            </div>
        </div>
    `,
    tcp: `
        <div class='mb-3'>
            <label class='form-label'>Timeout (seconds)</label>
            <input type='text' class='form-control timeout' value='5s' pattern='^[1-9][0-9]*s$' placeholder='5s'>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Preferred IP Protocol</label>
            <select class='form-control preferred-ip-protocol'>
                <option value='ip4'>IPv4</option>
                <option value='ip6'>IPv6</option>
            </select>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input ip-protocol-fallback' type='checkbox' checked>
                <label class='form-check-label'>Try fallback IP protocol if preferred fails</label>
            </div>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input enable-tls' type='checkbox' onchange="toggleTlsConfig(this)">
                <label class='form-check-label'>Enable TLS Configuration</label>
            </div>
        </div>
        <div class='tls-config' style='display: none;'>
            <div class='mb-3'>
                <label class='form-label'>CA File</label>
                <input type='text' class='form-control tls-ca-file' placeholder='/etc/blackbox/certs/ca.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Certificate File</label>
                <input type='text' class='form-control tls-cert-file' placeholder='/etc/blackbox/certs/client.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Key File</label>
                <input type='text' class='form-control tls-key-file' placeholder='/etc/blackbox/certs/client.key'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Server Name</label>
                <input type='text' class='form-control tls-server-name' placeholder='my.api.server.com'>
            </div>
        </div>
    `,
    ping: `
        <div class='mb-3'>
            <label class='form-label'>Timeout (seconds)</label>
            <input type='text' class='form-control timeout' value='5s' pattern='^[1-9][0-9]*s$' placeholder='5s'>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Host</label>
            <input type='text' class='form-control ping-host' placeholder='example.com' required>
        </div>
        <div class='mb-3'>
            <label class='form-label'>Number of Packets</label>
            <input type='number' class='form-control packet-count' value='4' min='1' max='10'>
        </div>
        <div class='mb-3'>
            <div class='form-check'>
                <input class='form-check-input enable-tls' type='checkbox' onchange="toggleTlsConfig(this)">
                <label class='form-check-label'>Enable TLS Configuration</label>
            </div>
        </div>
        <div class='tls-config' style='display: none;'>
            <div class='mb-3'>
                <label class='form-label'>CA File</label>
                <input type='text' class='form-control tls-ca-file' placeholder='/etc/blackbox/certs/ca.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Certificate File</label>
                <input type='text' class='form-control tls-cert-file' placeholder='/etc/blackbox/certs/client.pem'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Key File</label>
                <input type='text' class='form-control tls-key-file' placeholder='/etc/blackbox/certs/client.key'>
            </div>
            <div class='mb-3'>
                <label class='form-label'>Server Name</label>
                <input type='text' class='form-control tls-server-name' placeholder='my.api.server.com'>
            </div>
        </div>
    `
};

// Export functions to window object for use in HTML
window.addNewModule = function() {
    const template = document.getElementById('moduleTemplate');
    const moduleCard = template.content.cloneNode(true);
    document.getElementById('modulesList').appendChild(moduleCard);
    
    // Add event listeners to the new module
    const newModule = document.querySelector('.module-card:last-child');
    setupModuleEventListeners(newModule);
    
    updateJsonOutput();
};

window.setupModuleEventListeners = function(moduleCard) {
    const form = moduleCard.querySelector('.module-form');
    
    // Next stage button
    form.querySelector('.next-stage').addEventListener('click', function() {
        const type = form.querySelector('.module-type').value;
        if (!type) {
            alert('Please select a module type');
            return;
        }
        form.querySelector('.stage1').style.display = 'none';
        form.querySelector('.stage2').style.display = 'block';
        form.querySelector('.probe-fields').innerHTML = probeFields[type] || '';
        updateJsonOutput();
    });

    // Back button
    form.querySelector('.prev-stage').addEventListener('click', function() {
        form.querySelector('.stage2').style.display = 'none';
        form.querySelector('.stage1').style.display = 'block';
        updateJsonOutput();
    });

    // Add input/change listeners to all form elements
    form.addEventListener('input', updateJsonOutput);
    form.addEventListener('change', updateJsonOutput);
};

window.removeModule = function(button) {
    const moduleCard = button.closest('.module-card');
    moduleCard.remove();
    updateJsonOutput();
};

window.handleModuleTypeChange = function(select) {
    const moduleCard = select.closest('.module-card');
    const probeFields = moduleCard.querySelector('.probe-fields');
    probeFields.innerHTML = probeFields[select.value] || '';
    updateJsonOutput();
};

window.togglePostFields = function(select) {
    const moduleCard = select.closest('.module-card');
    const postFields = moduleCard.querySelector('.post-fields');
    postFields.style.display = (select.value === 'POST' || select.value === 'PUT') ? 'block' : 'none';
    updateJsonOutput();
};

window.toggleTlsConfig = function(checkbox) {
    const moduleCard = checkbox.closest('.module-card');
    const tlsConfig = moduleCard.querySelector('.tls-config');
    tlsConfig.style.display = checkbox.checked ? 'block' : 'none';
    updateJsonOutput();
};

window.toggleModuleConfig = function(element) {
    const moduleCard = element.closest('.module-card');
    const cardBody = moduleCard.querySelector('.card-body');
    const icon = element.querySelector('i');
    
    if (cardBody.style.display === 'none') {
        cardBody.style.display = 'block';
        moduleCard.style.marginBottom = '1rem';
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
    } else {
        cardBody.style.display = 'none';
        moduleCard.style.marginBottom = '0.5rem';
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
    }
};

window.updateModuleDisplay = function(input) {
    const moduleCard = input.closest('.module-card');
    const displayElement = moduleCard.querySelector('.module-name-display');
    displayElement.textContent = input.value || 'Module';
};

// Expose generateConfigObject to window
window.generateConfigObject = function() {
    const config = {
        modules: {}
    };

    document.querySelectorAll('.module-card').forEach(moduleCard => {
        const form = moduleCard.querySelector('.module-form');
        const moduleName = form.querySelector('.module-name').value || `module_${moduleCounter++}`;
        
        config.modules[moduleName] = {
            prober: form.querySelector('.module-type').value,
            timeout: form.querySelector('.timeout')?.value || '5s',
            [form.querySelector('.module-type').value]: {}
        };

        const type = form.querySelector('.module-type').value;
        if (type === 'http') {
            const httpConfig = config.modules[moduleName].http;
            
            // Basic HTTP config
            httpConfig.method = form.querySelector('.http-method').value;
            const statusCodes = form.querySelector('.valid-status-codes').value
                .split(',')
                .map(code => parseInt(code.trim()))
                .filter(code => !isNaN(code));
            httpConfig.valid_status_codes = statusCodes.length > 0 ? statusCodes : [200];

            // Add TLS config if enabled
            if (form.querySelector('.enable-tls').checked) {
                httpConfig.tls = true;
                const tlsConfig = {
                    ca_file: form.querySelector('.tls-ca-file').value,
                    cert_file: form.querySelector('.tls-cert-file').value,
                    key_file: form.querySelector('.tls-key-file').value,
                    server_name: form.querySelector('.tls-server-name').value
                };
                
                // Only add non-empty values
                Object.keys(tlsConfig).forEach(key => {
                    if (!tlsConfig[key]) {
                        delete tlsConfig[key];
                    }
                });
                
                if (Object.keys(tlsConfig).length > 0) {
                    httpConfig.tls_config = tlsConfig;
                }
            }

            // Headers
            const headers = {};
            form.querySelector('.headers').value.split('\n').forEach(line => {
                const [key, value] = line.split(':').map(item => item.trim());
                if (key && value) {
                    headers[key] = value;
                }
            });
            if (Object.keys(headers).length > 0) {
                httpConfig.headers = headers;
            }

            // POST/PUT specific fields
            if (httpConfig.method === 'POST' || httpConfig.method === 'PUT') {
                const contentType = form.querySelector('.content-type').value;
                if (contentType) {
                    if (!httpConfig.headers) httpConfig.headers = {};
                    httpConfig.headers['Content-Type'] = contentType;
                }
                const body = form.querySelector('.request-body').value;
                if (body) {
                    httpConfig.body = body;
                }
            }

            // HTTP versions
            const versions = Array.from(form.querySelectorAll('.http-version:checked')).map(cb => cb.value);
            if (versions.length > 0) {
                httpConfig.valid_http_versions = versions;
            }

            // Fail conditions
            const failIfBodyMatches = form.querySelector('.fail-if-body-matches').value.split('\n').filter(line => line.trim());
            if (failIfBodyMatches.length > 0) {
                httpConfig.fail_if_body_matches_regexp = failIfBodyMatches;
            }

            const failIfBodyNotMatches = form.querySelector('.fail-if-body-not-matches').value.split('\n').filter(line => line.trim());
            if (failIfBodyNotMatches.length > 0) {
                httpConfig.fail_if_body_not_matches_regexp = failIfBodyNotMatches;
            }

            if (form.querySelector('.fail-if-ssl').checked) {
                httpConfig.fail_if_ssl = true;
            }
            if (form.querySelector('.fail-if-not-ssl').checked) {
                httpConfig.fail_if_not_ssl = true;
            }

            // IP protocol settings
            const preferredIPProtocol = form.querySelector('.preferred-ip-protocol').value;
            if (preferredIPProtocol) {
                httpConfig.preferred_ip_protocol = preferredIPProtocol;
            }
            if (form.querySelector('.ip-protocol-fallback').checked) {
                httpConfig.ip_protocol_fallback = true;
            }

            // Redirect settings
            if (form.querySelector('.no-follow-redirects').checked) {
                httpConfig.no_follow_redirects = true;
            }
        } else if (type === 'tcp') {
            const tcpConfig = config.modules[moduleName].tcp;
            
            // Add preferred IP protocol
            const preferredIPProtocol = form.querySelector('.preferred-ip-protocol').value;
            if (preferredIPProtocol) {
                tcpConfig.preferred_ip_protocol = preferredIPProtocol;
            }
            
            // Add IP protocol fallback
            if (form.querySelector('.ip-protocol-fallback').checked) {
                tcpConfig.ip_protocol_fallback = true;
            }

            // Add TLS config if enabled
            if (form.querySelector('.enable-tls').checked) {
                tcpConfig.tls = true;
                const tlsConfig = {
                    ca_file: form.querySelector('.tls-ca-file').value,
                    cert_file: form.querySelector('.tls-cert-file').value,
                    key_file: form.querySelector('.tls-key-file').value,
                    server_name: form.querySelector('.tls-server-name').value
                };
                
                // Only add non-empty values
                Object.keys(tlsConfig).forEach(key => {
                    if (!tlsConfig[key]) {
                        delete tlsConfig[key];
                    }
                });
                
                if (Object.keys(tlsConfig).length > 0) {
                    tcpConfig.tls_config = tlsConfig;
                }
            }
        } else if (type === 'ping') {
            const pingConfig = config.modules[moduleName].ping;
            pingConfig.host = form.querySelector('.ping-host').value;
            pingConfig.packet_count = parseInt(form.querySelector('.packet-count').value);

            // Add TLS config if enabled
            if (form.querySelector('.enable-tls').checked) {
                pingConfig.tls = true;
                const tlsConfig = {
                    ca_file: form.querySelector('.tls-ca-file').value,
                    cert_file: form.querySelector('.tls-cert-file').value,
                    key_file: form.querySelector('.tls-key-file').value,
                    server_name: form.querySelector('.tls-server-name').value
                };
                
                // Only add non-empty values
                Object.keys(tlsConfig).forEach(key => {
                    if (!tlsConfig[key]) {
                        delete tlsConfig[key];
                    }
                });
                
                if (Object.keys(tlsConfig).length > 0) {
                    pingConfig.tls_config = tlsConfig;
                }
            }
        }
    });

    return config;
};

function updateJsonOutput() {
    const config = generateConfigObject();
    const yaml = jsyaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
    });
    document.getElementById('configOutput').textContent = yaml;
}

// Add download functionality
window.downloadConfig = function() {
    try {
        const config = generateConfigObject();
        const yamlConfig = jsyaml.dump(config, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
        });

        // Get the first module name or use a default
        const moduleName = Object.keys(config.modules)[0] || 'config';
        const filename = `${moduleName}.yml`;

        // Create and trigger download
        const blob = new Blob([yamlConfig], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading config:', error);
        alert('Failed to download configuration. Please try again.');
    }
};

window.handleFileUpload = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const yamlContent = e.target.result;
            console.log('File content:', yamlContent); // Debug log
            
            // Try to parse the YAML
            const config = jsyaml.load(yamlContent);
            console.log('Parsed config:', config); // Debug log
            
            if (!config || typeof config !== 'object') {
                throw new Error('Invalid configuration format: must be an object');
            }
            
            // Ensure modules exist
            if (!config.modules || typeof config.modules !== 'object') {
                throw new Error('Invalid configuration: missing or invalid modules section');
            }
            
            // Update the configuration output
            const formattedYaml = jsyaml.dump(config, {
                indent: 2,
                lineWidth: -1,
                noRefs: true,
                sortKeys: false
            });
            document.getElementById('configOutput').textContent = formattedYaml;
            
            // Update form fields
            updateFormFromConfig(config);
            
            // Clear the file input to allow uploading the same file again
            input.value = '';
            
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            alert(`Error loading configuration: ${error.message}`);
        }
    };
    
    reader.onerror = function(error) {
        console.error('File reading error:', error);
        alert('Error reading the file. Please try again.');
    };
    
    reader.readAsText(file);
};

window.updateFormFromConfig = function(config) {
    // Clear existing modules
    const modulesList = document.getElementById('modulesList');
    modulesList.innerHTML = '';
    
    // Add modules from config
    if (config.modules) {
        Object.entries(config.modules).forEach(([moduleName, moduleConfig]) => {
            // Create new module
            window.addNewModule();
            
            // Get the newly created module card
            const moduleCard = modulesList.lastElementChild;
            if (!moduleCard) return;
            
            const form = moduleCard.querySelector('.module-form');
            if (!form) return;
            
            // Set basic module info
            const nameInput = form.querySelector('.module-name');
            const typeSelect = form.querySelector('.module-type');
            
            if (nameInput) nameInput.value = moduleName;
            if (typeSelect) {
                typeSelect.value = moduleConfig.prober;
                // Trigger module type change to show appropriate fields
                typeSelect.dispatchEvent(new Event('change'));
            }
            
            // Move to stage 2
            const nextButton = form.querySelector('.next-stage');
            if (nextButton) nextButton.click();
            
            // Set module-specific fields
            const type = moduleConfig.prober;
            if (type === 'http') {
                const httpConfig = moduleConfig.http;
                if (httpConfig) {
                    const timeoutInput = form.querySelector('.timeout');
                    const methodSelect = form.querySelector('.http-method');
                    const statusCodesInput = form.querySelector('.valid-status-codes');
                    
                    if (timeoutInput) timeoutInput.value = moduleConfig.timeout || '5s';
                    if (methodSelect) methodSelect.value = httpConfig.method || 'GET';
                    if (statusCodesInput) {
                        // Convert status codes to array if it's a single number
                        let statusCodes = httpConfig.valid_status_codes;
                        if (typeof statusCodes === 'number') {
                            statusCodes = [statusCodes];
                        }
                        statusCodesInput.value = statusCodes?.join(',') || '';
                    }
                    
                    // Handle headers
                    if (httpConfig.headers) {
                        const headersTextarea = form.querySelector('.headers');
                        if (headersTextarea) {
                            const headersText = Object.entries(httpConfig.headers)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n');
                            headersTextarea.value = headersText;
                        }
                    }
                    
                    // Handle POST/PUT specific fields
                    if (httpConfig.method === 'POST' || httpConfig.method === 'PUT') {
                        const contentTypeSelect = form.querySelector('.content-type');
                        const bodyTextarea = form.querySelector('.request-body');
                        
                        if (contentTypeSelect) contentTypeSelect.value = httpConfig.headers?.['Content-Type'] || 'application/json';
                        if (bodyTextarea) bodyTextarea.value = httpConfig.body || '';
                    }
                    
                    // Handle HTTP versions
                    if (httpConfig.valid_http_versions) {
                        form.querySelectorAll('.http-version').forEach(checkbox => {
                            checkbox.checked = httpConfig.valid_http_versions.includes(checkbox.value);
                        });
                    }
                    
                    // Handle fail conditions
                    const failIfBodyMatches = form.querySelector('.fail-if-body-matches');
                    const failIfBodyNotMatches = form.querySelector('.fail-if-body-not-matches');
                    const failIfSsl = form.querySelector('.fail-if-ssl');
                    const failIfNotSsl = form.querySelector('.fail-if-not-ssl');
                    
                    if (failIfBodyMatches && httpConfig.fail_if_body_matches_regexp) {
                        failIfBodyMatches.value = httpConfig.fail_if_body_matches_regexp.join('\n');
                    }
                    if (failIfBodyNotMatches && httpConfig.fail_if_body_not_matches_regexp) {
                        failIfBodyNotMatches.value = httpConfig.fail_if_body_not_matches_regexp.join('\n');
                    }
                    if (failIfSsl) failIfSsl.checked = httpConfig.fail_if_ssl || false;
                    if (failIfNotSsl) failIfNotSsl.checked = httpConfig.fail_if_not_ssl || false;
                    
                    // Handle IP protocol settings
                    const preferredIPProtocol = form.querySelector('.preferred-ip-protocol');
                    const ipProtocolFallback = form.querySelector('.ip-protocol-fallback');
                    
                    if (preferredIPProtocol) preferredIPProtocol.value = httpConfig.preferred_ip_protocol || 'ip4';
                    if (ipProtocolFallback) ipProtocolFallback.checked = httpConfig.ip_protocol_fallback || false;
                    
                    // Handle redirect settings
                    const noFollowRedirects = form.querySelector('.no-follow-redirects');
                    if (noFollowRedirects) noFollowRedirects.checked = httpConfig.no_follow_redirects || false;
                }
            } else if (type === 'tcp') {
                const tcpConfig = moduleConfig.tcp;
                if (tcpConfig) {
                    const timeoutInput = form.querySelector('.timeout');
                    const preferredIPProtocol = form.querySelector('.preferred-ip-protocol');
                    const ipProtocolFallback = form.querySelector('.ip-protocol-fallback');
                    
                    if (timeoutInput) timeoutInput.value = moduleConfig.timeout || '5s';
                    if (preferredIPProtocol) preferredIPProtocol.value = tcpConfig.preferred_ip_protocol || 'ip4';
                    if (ipProtocolFallback) ipProtocolFallback.checked = tcpConfig.ip_protocol_fallback || false;
                }
            } else if (type === 'ping') {
                const pingConfig = moduleConfig.ping;
                if (pingConfig) {
                    const timeoutInput = form.querySelector('.timeout');
                    const hostInput = form.querySelector('.ping-host');
                    const packetCountInput = form.querySelector('.packet-count');
                    
                    if (timeoutInput) timeoutInput.value = moduleConfig.timeout || '5s';
                    if (hostInput) hostInput.value = pingConfig.host || '';
                    if (packetCountInput) packetCountInput.value = pingConfig.packet_count || 4;
                }
            }
            
            // Update module display name
            if (nameInput) nameInput.dispatchEvent(new Event('input'));
        });
    }
}; 