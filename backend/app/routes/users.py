from flask import Blueprint, request, jsonify
from app.models import User
from app import db, bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy.exc import SQLAlchemyError

users_bp = Blueprint('users', __name__)

# Get all users (admin only)
@users_bp.route('', methods=['GET'])
@jwt_required()
def get_all_users():
    # Check if user is admin
    claims = get_jwt()
    if not claims.get('is_admin', False):
        return jsonify({'error': 'Admin access required'}), 403
    
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get a specific user
@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Update a user
@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims.get('is_admin', False)
    
    # Check if user is updating their own profile or is an admin
    if current_user_id != user_id and not is_admin:
        return jsonify({'error': 'Permission denied'}), 403
    
    data = request.get_json()
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update fields
        if 'username' in data and data['username'] != user.username:
            # Check if username already exists
            if User.query.filter_by(username=data['username']).first():
                return jsonify({'error': 'Username already exists'}), 400
            user.username = data['username']
            
        if 'email' in data and data['email'] != user.email:
            # Check if email already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
            user.email = data['email']
            
        if 'bio' in data:
            user.bio = data['bio']
            
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']
            
        # Only admin can update admin status
        if 'is_admin' in data and is_admin:
            user.is_admin = data['is_admin']
            
        # Update password if provided
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a user
@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims.get('is_admin', False)
    
    # Check if user is deleting their own account or is an admin
    if current_user_id != user_id and not is_admin:
        return jsonify({'error': 'Permission denied'}), 403
    
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500