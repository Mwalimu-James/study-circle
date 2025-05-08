from flask import Blueprint, request, jsonify, current_app
from app.models import File, User, Group
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import uuid

files_bp = Blueprint('files', __name__)

# Helper function to create upload directory if it doesn't exist
def ensure_upload_dir():
    upload_dir = os.path.join(current_app.root_path, 'uploads')
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    return upload_dir

# Upload a file
@files_bp.route('', methods=['POST'])
@jwt_required()
def upload_file():
    user_id = get_jwt_identity()
    
    # Check if file is in request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Get group_id from form data
    group_id = request.form.get('group_id')
    if not group_id:
        return jsonify({'error': 'Group ID is required'}), 400
    
    # Check if group exists
    group = Group.query.get(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    # Check if user is a member of the group
    user = User.query.get(user_id)
    if user not in group.members:
        return jsonify({'error': 'You must be a member of the group to upload files'}), 403
    
    try:
        # Create unique filename to prevent collisions
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Create the upload directory if it doesn't exist
        upload_dir = ensure_upload_dir()
        
        # Save the file
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)
        
        # Create database record
        new_file = File(
            filename=filename,
            file_path=unique_filename,  # Store only the filename in the database
            description=request.form.get('description', ''),
            uploader_id=user_id,
            group_id=group_id
        )
        
        db.session.add(new_file)
        db.session.commit()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'file': new_file.to_dict()
        }), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get files for a specific group
@files_bp.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_files_by_group(group_id):
    user_id = get_jwt_identity()
    
    # Check if group exists
    group = Group.query.get(group_id)
    if not group:
        return jsonify({'error': 'Group not found'}), 404
    
    # Check if user is a member of the group
    user = User.query.get(user_id)
    if user not in group.members:
        return jsonify({'error': 'You must be a member of the group to view files'}), 403
    
    try:
        files = File.query.filter_by(group_id=group_id).all()
        return jsonify([file.to_dict() for file in files]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get a specific file
@files_bp.route('/<int:file_id>', methods=['GET'])
@jwt_required()
def get_file(file_id):
    user_id = get_jwt_identity()
    
    try:
        file = File.query.get(file_id)
        
        if not file:
            return jsonify({'error': 'File not found'}), 404
        
        # Check if user is a member of the group
        group = Group.query.get(file.group_id)
        user = User.query.get(user_id)
        if user not in group.members:
            return jsonify({'error': 'You must be a member of the group to view this file'}), 403
        
        return jsonify(file.to_dict()), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Delete a file
@files_bp.route('/<int:file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    user_id = get_jwt_identity()
    
    try:
        file = File.query.get(file_id)
        
        if not file:
            return jsonify({'error': 'File not found'}), 404
        
        # Check if user is the uploader or an admin
        user = User.query.get(user_id)
        if file.uploader_id != user_id and not user.is_admin:
            return jsonify({'error': 'Permission denied. Only the uploader or an admin can delete the file'}), 403
        
        # Delete file from disk
        upload_dir = ensure_upload_dir()
        file_path = os.path.join(upload_dir, file.file_path)
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete database record
        db.session.delete(file)
        db.session.commit()
        
        return jsonify({'message': 'File deleted successfully'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500