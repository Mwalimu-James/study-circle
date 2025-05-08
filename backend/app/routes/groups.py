from flask import Blueprint, request, jsonify
from app.models import Group, User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError

groups_bp = Blueprint('groups', __name__)

# Create a new group
@groups_bp.route('', methods=['POST'])
@jwt_required()
def create_group():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return jsonify({'error': 'Group name is required'}), 400
    
    try:
        new_group = Group(
            name=data['name'],
            description=data.get('description', ''),
            owner_id=user_id
        )
        
        # Add the creator as a member
        user = User.query.get(user_id)
        new_group.members.append(user)
        
        db.session.add(new_group)
        db.session.commit()
        
        return jsonify({
            'message': 'Group created successfully',
            'group': new_group.to_dict()
        }), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get all groups
@groups_bp.route('', methods=['GET'])
@jwt_required()
def get_all_groups():
    try:
        groups = Group.query.all()
        return jsonify([group.to_dict() for group in groups]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Get a specific group
@groups_bp.route('/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    try:
        group = Group.query.get(group_id)
        
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        return jsonify(group.to_dict()), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

# Update a group
@groups_bp.route('/<int:group_id>', methods=['PUT'])
@jwt_required()
def update_group(group_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        group = Group.query.get(group_id)
        
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        # Check if user is the owner
        if group.owner_id != user_id:
            return jsonify({'error': 'Permission denied. Only the group owner can update the group'}), 403
        
        # Update fields
        if 'name' in data:
            group.name = data['name']
        if 'description' in data:
            group.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Group updated successfully',
            'group': group.to_dict()
        }), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete a group
@groups_bp.route('/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    user_id = int(get_jwt_identity())  # ✅ Force same type as group.owner_id
    group = Group.query.get(group_id)

    if not group:
        return jsonify({'error': 'Group not found'}), 404

    if group.owner_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    try:
        db.session.delete(group)
        db.session.commit()
        return jsonify({'message': 'Group deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



# Join a group
@groups_bp.route('/<int:group_id>/join', methods=['POST'])
@jwt_required()
def join_group(group_id):
    user_id = get_jwt_identity()
    
    try:
        group = Group.query.get(group_id)
        user = User.query.get(user_id)
        
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user is already a member
        if user in group.members:
            return jsonify({'message': 'User is already a member of this group'}), 200
        
        # Add user to group
        group.members.append(user)
        db.session.commit()
        
        return jsonify({'message': 'Successfully joined the group'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Leave a group
@groups_bp.route('/<int:group_id>/leave', methods=['POST'])
@jwt_required()
def leave_group(group_id):
    user_id = get_jwt_identity()
    
    try:
        group = Group.query.get(group_id)
        user = User.query.get(user_id)
        
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if user is the owner
        if group.owner_id == user_id:
            return jsonify({'error': 'Group owner cannot leave the group. Transfer ownership first or delete the group'}), 403
        
        # Check if user is a member
        if user not in group.members:
            return jsonify({'message': 'User is not a member of this group'}), 200
        
        # Remove user from group
        group.members.remove(user)
        db.session.commit()
        
        return jsonify({'message': 'Successfully left the group'}), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get group members
@groups_bp.route('/<int:group_id>/members', methods=['GET'])
@jwt_required()
def get_group_members(group_id):
    try:
        group = Group.query.get(group_id)
        
        if not group:
            return jsonify({'error': 'Group not found'}), 404
        
        members = group.members.all()
        
        return jsonify([member.to_dict() for member in members]), 200
    
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500