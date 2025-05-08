from flask import Blueprint, request, jsonify
from app.models import Article, User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

articles_bp = Blueprint('articles', __name__)

# Create a new article
@articles_bp.route('', methods=['POST'])
@jwt_required()
def create_article():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'content']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        new_article = Article(
            title=data['title'],
            content=data['content'],
            tags=data.get('tags', ''),
            author_id=user_id
        )
        
        db.session.add(new_article)
        db.session.commit()
        
        return jsonify({
            'message': 'Article created successfully',
            'article': new_article.to_dict()
        }), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all articles
@articles_bp.route('', methods=['GET'])
@jwt_required()
def get_all_articles():
    try:
        articles = Article.query.all()
        return jsonify([article.to_dict() for article in articles]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get articles by author
@articles_bp.route('/author/<int:author_id>', methods=['GET'])
@jwt_required()
def get_articles_by_author(author_id):
    try:
        # Check if user exists
        user = User.query.get(author_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        articles = Article.query.filter_by(author_id=author_id).all()
        return jsonify([article.to_dict() for article in articles]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get a specific article
@articles_bp.route('/<int:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    try:
        article = Article.query.get(article_id)
        
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        return jsonify(article.to_dict()), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Update an article
@articles_bp.route('/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        article = Article.query.get(article_id)
        
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        # Check if user is the author
        if article.author_id != user_id:
            return jsonify({'error': 'Permission denied. Only the author can update the article'}), 403
        
        # Update fields
        if 'title' in data:
            article.title = data['title']
        if 'content' in data:
            article.content = data['content']
        if 'tags' in data:
            article.tags = data['tags']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Article updated successfully',
            'article': article.to_dict()
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete an article
@articles_bp.route('/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    user_id = get_jwt_identity()
    
    try:
        article = Article.query.get(article_id)
        
        if not article:
            return jsonify({'error': 'Article not found'}), 404
        
        # Check if user is the author or an admin
        user = User.query.get(user_id)
        if article.author_id != user_id and not user.is_admin:
            return jsonify({'error': 'Permission denied. Only the author or an admin can delete the article'}), 403
        
        db.session.delete(article)
        db.session.commit()
        
        return jsonify({'message': 'Article deleted successfully'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500