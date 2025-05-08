from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.groups import groups_bp
    from app.routes.sessions import sessions_bp
    from app.routes.files import files_bp
    from app.routes.articles import articles_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(groups_bp, url_prefix='/api/groups')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(articles_bp, url_prefix='/api/articles')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    @app.route("/")
    def index():
        return {"message": "Study Circle API is live!"}, 200

    @app.route("/healthz")
    def healthz():
        return "OK", 200

    
    return app