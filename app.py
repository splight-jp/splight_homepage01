from flask import Flask, render_template, send_from_directory, jsonify
import os

app = Flask(__name__, static_folder='.', template_folder='.')

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/styles.css')
def styles():
    """Serve CSS file with correct MIME type"""
    return send_from_directory('.', 'styles.css', mimetype='text/css')

@app.route('/script.js')
def script():
    """Serve JavaScript file with correct MIME type"""
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

@app.route('/favicon.ico')
def favicon():
    """Handle favicon requests"""
    return '', 204

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Splight Corporate Website'})

@app.route('/api/contact', methods=['POST'])
def contact():
    """Contact form endpoint (for future use)"""
    return jsonify({'message': 'Contact form received', 'status': 'success'})

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=False)

